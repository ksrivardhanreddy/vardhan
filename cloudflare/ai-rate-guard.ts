/** Internal rate-limit service. No public route or workers.dev endpoint. */
type GuardEnv = {
  VISITOR_LIMIT: {
    limit(input: { key: string }): Promise<{ success: boolean }>;
  };
  GLOBAL_LIMIT: {
    limit(input: { key: string }): Promise<{ success: boolean }>;
  };
};
export async function guardRequest(
  request: Request,
  env: GuardEnv,
): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  const text = await request.text();
  if (text.length > 100) return new Response(null, { status: 400 });
  let key: unknown;
  try {
    key = (JSON.parse(text) as { key?: unknown }).key;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof key !== "string" || !/^[a-f0-9]{64}$/.test(key))
    return new Response(null, { status: 400 });
  try {
    const visitor = await env.VISITOR_LIMIT.limit({ key });
    const global = await env.GLOBAL_LIMIT.limit({ key: "portfolio-ai" });
    return new Response(null, {
      status: visitor.success && global.success ? 204 : 429,
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
const worker = { fetch: guardRequest };
export default worker;
