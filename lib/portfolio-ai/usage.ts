export type UsageEvent = {
  category: string;
  latencyMs: number;
  mode: "off" | "mock" | "workers";
  model?: string;
  inputEstimate?: number;
  outputEstimate?: number;
};
/** Approximation for documented fp8-fast pricing only; actual dashboard metering is authoritative. */
export function estimateFastModelNeurons(
  inputTokens: number,
  outputTokens: number,
) {
  return (inputTokens * 4119 + outputTokens * 34868) / 1_000_000;
}
export function observeUsage(event: UsageEvent, enabled: boolean) {
  if (enabled) console.log(JSON.stringify({ event: "portfolio_ai", ...event }));
}
