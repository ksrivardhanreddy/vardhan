/** Present approved owner facts in the portfolio's first-person voice.
 * Source labels/URLs remain unchanged; this never adds facts. */
export function firstPerson(text: string): string {
  return text
    .replace(/\b(?:Vardhan|Srivardhan Reddy Kolan)[’']s\b/g, "my")
    .replace(/\b(?:contact|reach) Vardhan\b/gi, "contact me")
    .replace(/\b(?:about|with|for) Vardhan\b/gi, (s) =>
      s.replace(/Vardhan$/, "me"),
    )
    .replace(/\b(?:Vardhan|Srivardhan Reddy Kolan)\b/g, "I")
    .replace(/\bHis\b/g, "My")
    .replace(/\bhis\b/g, "my")
    .replace(/\bHe\b/g, "I")
    .replace(/\bhe\b/g, "I")
    .replace(/\bhim\b/g, "me")
    .replace(/\bI is\b/g, "I am")
    .replace(/\bI has\b/g, "I have")
    .replace(/\bI does\b/g, "I do")
    .replace(/\bI focuses\b/g, "I focus")
    .replace(
      /\bI (works|needs|prefers|brings|uses|holds|supports|describes|keeps|separates|confirms)\b/g,
      (_, verb: string) => `I ${verb.slice(0, -1)}`,
    )
    .replace(/(^|[.!?]\s+)my\b/g, "$1My");
}
