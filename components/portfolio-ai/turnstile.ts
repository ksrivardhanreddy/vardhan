type Turnstile = {
  render(node: HTMLElement, options: Record<string, unknown>): string;
  execute(id: string): void;
  remove(id: string): void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let scriptPromise: Promise<void> | undefined;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise)
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      const timer = setTimeout(() => fail(), 8000);
      function fail() {
        clearTimeout(timer);
        script.remove();
        scriptPromise = undefined;
        reject(new Error("Verification unavailable"));
      }
      script.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      script.onerror = fail;
      document.head.appendChild(script);
    });
  return scriptPromise;
}
export async function freshToken(
  node: HTMLElement,
  sitekey: string,
  signal: AbortSignal,
): Promise<string> {
  await loadScript();
  if (signal.aborted) throw new Error("Cancelled");
  return new Promise((resolve, reject) => {
    let widget: string | undefined;
    let done = false;
    function finish(token?: string) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
      if (widget) window.turnstile?.remove(widget);
      token ? resolve(token) : reject(new Error("Verification unavailable"));
    }
    const cancel = () => finish();
    const timer = setTimeout(cancel, 12000);
    signal.addEventListener("abort", cancel, { once: true });
    try {
      widget = window.turnstile!.render(node, {
        sitekey,
        action: "portfolio_chat",
        execution: "execute",
        appearance: "interaction-only",
        callback: (token: string) => finish(token),
        "error-callback": cancel,
        "expired-callback": cancel,
      });
      window.turnstile!.execute(widget);
    } catch {
      finish();
    }
  });
}
