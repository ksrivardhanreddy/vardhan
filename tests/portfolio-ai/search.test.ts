import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { search, tokenize } from "../../lib/portfolio-ai/search";
import { composeAnswer } from "../../lib/portfolio-ai/extractive-answer";
import { buildPrompt } from "../../lib/portfolio-ai/prompt";
import { validateIndex } from "../../lib/portfolio-ai/privacy";
import type { KnowledgeIndex } from "../../lib/portfolio-ai/types";
const index = JSON.parse(
  readFileSync("public/knowledge-base/index.json", "utf8"),
) as KnowledgeIndex;
const cases = JSON.parse(
  readFileSync("docs/ai-assistant/evaluation-questions.json", "utf8"),
) as { question: string; expected?: string[]; refuse?: boolean }[];
for (const item of cases)
  test(`retrieval: ${item.question}`, () => {
    const result = search(index, item.question);
    if (item.refuse) {
      assert.equal(result.state, "none");
      assert.deepEqual(composeAnswer(index, item.question).sources, []);
    } else
      assert.ok(
        result.results
          .slice(0, 3)
          .some((r) =>
            item.expected!.some((id) => r.chunk.documentId.startsWith(id)),
          ),
        JSON.stringify(result.results.slice(0, 3).map((r) => r.chunk.id)),
      );
  });
test("corpus schema, aliases and original factual status are preserved", () => {
  assert.ok(validateIndex(index));
  assert.deepEqual(tokenize("CI/CD K3s EKS"), ["cicd", "k3s", "eks"]);
  const rhce = composeAnswer(index, "Do you hold RHCE?");
  assert.match(rhce.answer, /expired/);
  assert.doesNotMatch(rhce.answer, /(?<!not currently )active/);
  const ai = composeAnswer(
    index,
    "What is Vardhan learning about AI platforms?",
  );
  assert.match(ai.answer, /learning|planned/i);
  assert.doesNotMatch(ai.answer, /operates a production/i);
  const resume = composeAnswer(index, "Where is the resume?");
  assert.equal(resume.sources[0].url, "/resume.pdf");
});
test("context is bounded and only trusted results become sources", () => {
  const retrieval = search(index, "Kubernetes projects");
  const prompt = buildPrompt("Kubernetes projects", retrieval.results);
  assert.ok(prompt.messages.map((m) => m.content).join("").length <= 4800);
  assert.ok(prompt.used.length <= 3);
  const answer = composeAnswer(index, "Kubernetes projects");
  assert.ok(answer.sources.length <= 3);
  assert.ok(
    answer.sources.every((s) =>
      index.chunks.some((c) => c.id === s.id && c.url === s.url),
    ),
  );
});
test("retrieval is identical for browser and server: no environment-dependent state", () => {
  for (const item of cases)
    assert.deepEqual(
      search(structuredClone(index), item.question),
      search(index, item.question),
    );
});
test("generic certification lookup includes current and historical statuses without confusing them", () => {
  const answer = composeAnswer(index, "What certifications does Vardhan have?");
  assert.match(answer.answer, /Kubernetes Administrator/);
  assert.match(answer.answer, /Solutions Architect/);
  assert.match(answer.answer, /expired/);
  const selected = composeAnswer(index, "Does he have CKA and AWS certs?");
  assert.match(selected.answer, /Kubernetes Administrator/);
  assert.match(selected.answer, /Solutions Architect/);
  assert.doesNotMatch(selected.answer, /Red Hat/);
});
for (const question of [
  "explain projects",
  "projects",
  "show me your projects",
  "what are his skills?",
  "skills",
  "tell me about your experience",
  "experience",
  "whats his experience?",
  "what's his experience?",
  "What’s his experience?",
  "whats your experience",
  "whats his skills?",
  "whats his projects?",
  "tell me about yourself",
  "what do you do?",
])
  test(`short overview works without inference: ${question}`, () => {
    const result = search(index, question);
    const answer = composeAnswer(index, question);
    assert.equal(result.direct, true);
    assert.notEqual(result.state, "none");
    assert.ok(answer.sources.length > 0);
    assert.doesNotMatch(answer.answer, /I don't have verified information/);
    assert.ok(answer.answer.length <= 1600);
  });
test("greeting is useful and broad intent does not swallow unsupported subjects", () => {
  assert.match(composeAnswer(index, "hello").answer, /Hi!/);
  assert.equal(
    search(index, "explain quantum satellite projects").state,
    "none",
  );
  assert.equal(search(index, "explain private company projects").state, "none");
  assert.notEqual(
    composeAnswer(index, "projects").answer,
    composeAnswer(index, "skills").answer,
  );
});
test("short overview includes substantive projects and tool names, not just marketing labels", () => {
  const projects = composeAnswer(index, "explain projects");
  assert.match(projects.answer, /K3s/);
  assert.match(projects.answer, /GitLab/);
  assert.ok(projects.sources.length > 0);
  const skills = composeAnswer(index, "skills");
  assert.match(skills.answer, /AWS/);
  assert.match(skills.answer, /Terraform/);
});
