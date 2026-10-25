import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { search } from "../lib/portfolio-ai/search.ts";
import { createChatHandler } from "../lib/portfolio-ai/handler.ts";
const index = JSON.parse(
  readFileSync("public/knowledge-base/index.json", "utf8"),
);
const cases = JSON.parse(
  readFileSync("docs/ai-assistant/evaluation-questions.json", "utf8"),
);
const handler = createChatHandler();
const rows = [];
for (const item of cases) {
  const start = performance.now();
  const retrieval = search(index, item.question);
  const response = await handler(
    new Request("http://127.0.0.1:3002/api/chat", {
      method: "POST",
      headers: {
        Origin: "http://127.0.0.1:3002",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: item.question, turnstileToken: "" }),
    }),
    {
      AI_MODE: "mock",
      AI_ASSISTANT_ENABLED: "true",
      AI_ALLOWED_ORIGINS: "http://127.0.0.1:3002",
      ASSETS: { fetch: async () => Response.json(index) },
    },
  );
  const correct = item.refuse
    ? retrieval.state === "none" && response.status === 422
    : retrieval.results
        .slice(0, 3)
        .some((r) =>
          item.expected.some((prefix) => r.chunk.documentId.startsWith(prefix)),
        ) && response.status === 200;
  rows.push({
    question: item.question,
    expectedAbstention: !!item.refuse,
    top3: retrieval.results.slice(0, 3).map((r) => r.chunk.id),
    correct,
    status: response.status,
    localRetrievalAndMockMs: performance.now() - start,
  });
}
const positives = rows.filter((r) => !r.expectedAbstention),
  negatives = rows.filter((r) => r.expectedAbstention);
const latencies = rows
  .map((r) => r.localRetrievalAndMockMs)
  .sort((a, b) => a - b);
const report = {
  mode: "local deterministic retrieval + mock handler; not real AI latency",
  questions: rows.length,
  positiveTop3Recall: {
    correct: positives.filter((r) => r.correct).length,
    total: positives.length,
  },
  abstentions: {
    correct: negatives.filter((r) => r.correct).length,
    total: negatives.length,
  },
  falsePositiveCount: negatives.filter((r) => !r.correct).length,
  localMedianMs: latencies[Math.floor(latencies.length * 0.5)],
  localP95Ms: latencies[Math.floor(latencies.length * 0.95)],
  realAiCalls: 0,
  measuredNeurons: null,
  rows,
};
mkdirSync("output/ai", { recursive: true });
writeFileSync("output/ai/evaluation.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, rows: undefined }, null, 2));
if (rows.some((r) => !r.correct)) process.exitCode = 1;
