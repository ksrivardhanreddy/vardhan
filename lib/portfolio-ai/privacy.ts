/** Deliberately conservative policy gates. No visitor text is logged/stored. */
export function blockedQuestion(question: string): boolean {
  return /(?:home address|residen(?:ce|tial)|family|medical|password|secret|api[ -]?key|private (?:company|employer|incident|network|address)|internal (?:ticket|incident|domain)|ignore.{0,40}(?:rules|instructions)|system prompt|invent|pretend|fabricat|jailbreak|cat poem|write.{0,20}poem|service discovery)/i.test(
    question,
  );
}
export function validQuestion(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= 500 &&
    value.trim().split(/\s+/).length <= 90 &&
    !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
  );
}
export function safeSourceUrl(value: string): boolean {
  return (
    /^\/(?!\/)[\w/#.?=&%-]*$/.test(value) ||
    /^(?:https:\/\/(?:www\.)?(?:linkedin\.com|github\.com|credly\.com|rhtapps\.redhat\.com)\/[^\s<>"']+|mailto:sri@vardhan\.pro)$/.test(
      value,
    )
  );
}
export function validateIndex(
  value: unknown,
): value is import("./types").KnowledgeIndex {
  if (!value || typeof value !== "object") return false;
  const v = value as import("./types").KnowledgeIndex;
  if (
    v.schemaVersion !== 1 ||
    !/^[a-f0-9]{64}$/.test(v.corpusVersion) ||
    !Array.isArray(v.chunks) ||
    !v.chunks.length ||
    v.chunks.length > 500
  )
    return false;
  const ids = new Set<string>();
  return v.chunks.every((c) => {
    if (
      !c ||
      typeof c.id !== "string" ||
      ids.has(c.id) ||
      ![c.title, c.heading, c.text, c.documentId, c.url].every(
        (x) => typeof x === "string" && !!x.trim(),
      ) ||
      c.text.length > 6000 ||
      (c.questions !== undefined &&
        (!Array.isArray(c.questions) ||
          c.questions.length > 20 ||
          !c.questions.every(
            (q) => typeof q === "string" && q.length > 0 && q.length <= 500,
          ))) ||
      !Array.isArray(c.tags) ||
      !c.tags.every((x) => typeof x === "string") ||
      !safeSourceUrl(c.url) ||
      ![
        "about",
        "experience",
        "skill",
        "certification",
        "project",
        "blog",
        "contact",
        "learning",
      ].includes(c.contentType)
    )
      return false;
    ids.add(c.id);
    return true;
  });
}
