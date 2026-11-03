import { search } from "./search";
import { composeAnswer, sourcesFor } from "./extractive-answer";
import { validateIndex, validQuestion } from "./privacy";
import { ALLOWED_MODELS, buildPrompt, supportedOutput } from "./prompt";
import { observeUsage, type UsageEvent } from "./usage";
import { chatEnabled } from "./config";
import { firstPerson } from "./voice";
export type FetchBinding = { fetch(request: Request): Promise<Response> };
export type ChatEnv = {
  AI?: {
    run(
      model: string,
      input: {
        messages: { role: string; content: string }[];
        max_tokens: number;
        temperature: number;
      },
      options?: { signal: AbortSignal },
    ): Promise<unknown>;
  };
  ASSETS: FetchBinding;
  AI_RATE_GUARD?: FetchBinding;
  TURNSTILE_SECRET?: string;
  AI_MODE?: string;
  AI_ASSISTANT_ENABLED?: string;
  AI_FREE_TIER_CONFIRMED?: string;
  AI_MODEL?: string;
  AI_MAX_OUTPUT_TOKENS?: string;
  AI_ALLOWED_ORIGINS?: string;
  AI_TELEMETRY?: string;
  NEXT_PUBLIC_AI_WIDGET_ENABLED?: string;
};
const errorMessages: Record<string, string> = {
  INVALID_REQUEST: "Please send a short portfolio question.",
  VERIFICATION_REQUIRED: "Verification could not be completed.",
  RATE_LIMITED: "Please wait before requesting AI phrasing again.",
  NOT_ENOUGH_EVIDENCE:
    "There is not enough published evidence for AI phrasing.",
  AI_UNAVAILABLE:
    "AI phrasing is unavailable. Use the portfolio-content answer.",
  AI_TIMEOUT: "AI phrasing took too long. Use the portfolio-content answer.",
};
function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}
export function createChatHandler(
  deps: {
    fetcher?: typeof fetch;
    timeoutMs?: number;
    observe?: (event: UsageEvent) => void;
  } = {},
) {
  return async function handle(
    request: Request,
    env: ChatEnv,
  ): Promise<Response> {
    const start = Date.now();
    const mode =
      env.AI_MODE === "workers"
        ? "workers"
        : env.AI_MODE === "mock"
          ? "mock"
          : "off";
    const record = (category: string) => {
      const event = {
        category,
        latencyMs: Date.now() - start,
        mode,
      } as UsageEvent;
      deps.observe?.(event);
      observeUsage(event, env.AI_TELEMETRY === "true");
    };
    const fail = (code: string, status: number) => {
      record(code);
      return json({ error: { code, message: errorMessages[code] } }, status);
    };
    if (!chatEnabled(env.NEXT_PUBLIC_AI_WIDGET_ENABLED))
      return fail("AI_UNAVAILABLE", 503);
    if (request.method !== "POST") {
      const r = fail("INVALID_REQUEST", 405);
      r.headers.set("Allow", "POST");
      return r;
    }
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const configured = (env.AI_ALLOWED_ORIGINS ?? "https://www.vardhan.pro")
      .split(",")
      .map((s) => s.trim());
    if (!origin || origin !== url.origin || !configured.includes(origin))
      return fail("VERIFICATION_REQUIRED", 403);
    if (
      request.headers.get("Content-Type")?.split(";")[0].trim() !==
      "application/json"
    )
      return fail("INVALID_REQUEST", 400);
    if (Number(request.headers.get("Content-Length")) > 4096)
      return fail("INVALID_REQUEST", 400);
    let body: unknown;
    try {
      const reader = request.body?.getReader();
      if (!reader) return fail("INVALID_REQUEST", 400);
      const chunks: Uint8Array[] = [];
      let length = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 4096) {
          await reader.cancel();
          return fail("INVALID_REQUEST", 400);
        }
        chunks.push(value);
      }
      const all = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) {
        all.set(chunk, offset);
        offset += chunk.length;
      }
      body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(all));
    } catch {
      return fail("INVALID_REQUEST", 400);
    }
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).some((k) => !["question", "turnstileToken"].includes(k))
    )
      return fail("INVALID_REQUEST", 400);
    const { question, turnstileToken } = body as Record<string, unknown>;
    if (
      !validQuestion(question) ||
      typeof turnstileToken !== "string" ||
      turnstileToken.length > 2048
    )
      return fail("INVALID_REQUEST", 400);
    // Off and mock modes can never consume inference. Mock is deliberately loopback-only.
    if (mode === "off" || env.AI_ASSISTANT_ENABLED !== "true")
      return fail("AI_UNAVAILABLE", 503);
    if (mode === "mock" && !["127.0.0.1", "localhost"].includes(url.hostname))
      return fail("AI_UNAVAILABLE", 503);
    const controller = new AbortController();
    let timedOut = false;
    const timeoutMs = Math.min(deps.timeoutMs ?? 10000, 12000);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      // Covers all external work, including assets/verification/guard and the one AI call.
      const work = async () => {
        const asset = await env.ASSETS.fetch(
          new Request(new URL("/knowledge-base/index.json", url)),
        );
        if (!asset.ok) return fail("AI_UNAVAILABLE", 503);
        const index: unknown = await asset.json();
        if (!validateIndex(index)) return fail("AI_UNAVAILABLE", 503);
        const retrieval = search(index, question);
        if (!retrieval.results.length) return fail("NOT_ENOUGH_EVIDENCE", 422);
        if (mode === "mock" || retrieval.direct) {
          record(mode === "mock" ? "MOCK_KNOWLEDGE" : "DIRECT_KNOWLEDGE");
          return json(composeAnswer(index, question));
        }
        if (!turnstileToken || !env.TURNSTILE_SECRET)
          return fail("VERIFICATION_REQUIRED", 403);
        if (
          !env.AI ||
          !env.AI_RATE_GUARD ||
          env.AI_FREE_TIER_CONFIRMED !== "true"
        )
          return fail("AI_UNAVAILABLE", 503);
        const model = env.AI_MODEL ?? ALLOWED_MODELS[0];
        if (!(ALLOWED_MODELS as readonly string[]).includes(model))
          return fail("AI_UNAVAILABLE", 503);
        const verified = await (deps.fetcher ?? fetch)(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret: env.TURNSTILE_SECRET,
              response: turnstileToken,
            }),
            signal: controller.signal,
          },
        );
        if (!verified.ok) return fail("VERIFICATION_REQUIRED", 403);
        const result = (await verified.json()) as {
          success?: boolean;
          hostname?: string;
          action?: string;
          challenge_ts?: string;
        };
        const age = Date.now() - Date.parse(result.challenge_ts ?? "");
        if (
          !result.success ||
          result.hostname !== url.hostname ||
          result.action !== "portfolio_chat" ||
          !Number.isFinite(age) ||
          age < -30000 ||
          age > 300000
        )
          return fail("VERIFICATION_REQUIRED", 403);
        if (controller.signal.aborted) return fail("AI_TIMEOUT", 504);
        const ip = request.headers.get("CF-Connecting-IP");
        if (!ip) return fail("VERIFICATION_REQUIRED", 403);
        // Only validated visitors consume the shared rate-limit allowance.
        // The service-bound guard has no public URL or caller-controlled key.
        const digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(
            `${new Date().toISOString().slice(0, 10)}:${ip}`,
          ),
        );
        const key = Array.from(new Uint8Array(digest), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("");
        const guard = await env.AI_RATE_GUARD.fetch(
          new Request("https://rate-guard.internal/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          }),
        );
        if (guard.status === 429) return fail("RATE_LIMITED", 429);
        if (!guard.ok) return fail("AI_UNAVAILABLE", 503);
        const prompt = buildPrompt(question, retrieval.results);
        if (!prompt.used.length) return fail("NOT_ENOUGH_EVIDENCE", 422);
        const max = Number(env.AI_MAX_OUTPUT_TOKENS ?? 280);
        if (!Number.isInteger(max) || max < 1 || max > 280)
          return fail("AI_UNAVAILABLE", 503);
        const output = await env.AI.run(
          model,
          { messages: prompt.messages, max_tokens: max, temperature: 0.1 },
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return fail("AI_TIMEOUT", 504);
        const answer =
          typeof output === "object" && output !== null && "response" in output
            ? (output as { response: unknown }).response
            : null;
        if (
          typeof answer !== "string" ||
          !supportedOutput(
            answer,
            prompt.used.map((r) => r.chunk.text).join(" "),
          )
        )
          return fail("AI_UNAVAILABLE", 503);
        record("AI_SUCCESS");
        return json({
          mode: "ai",
          answer: firstPerson(answer),
          sources: sourcesFor(prompt.used),
          model,
          requestId: crypto.randomUUID(),
        });
      };
      return await Promise.race([
        work(),
        new Promise<Response>((resolve) => {
          timeout = setTimeout(() => {
            timedOut = true;
            controller.abort();
            resolve(fail("AI_TIMEOUT", 504));
          }, timeoutMs);
        }),
      ]);
    } catch {
      return fail(
        timedOut ? "AI_TIMEOUT" : "AI_UNAVAILABLE",
        timedOut ? 504 : 503,
      );
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  };
}
export const handleChat = createChatHandler();
