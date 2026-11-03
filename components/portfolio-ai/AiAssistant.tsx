"use client";
import {
  Component,
  lazy,
  Suspense,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MessageCircle } from "lucide-react";
const Panel = lazy(() => import("./AiChatPanel"));
class PanelBoundary extends Component<
  { open: boolean; onClose: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return this.props.open ? (
        <div className="ai-loading-panel" role="alert">
          <p>
            The assistant could not load. Check your connection and reload this
            page to try again.
          </p>
          <button
            className="button button-secondary"
            onClick={this.props.onClose}
          >
            Close assistant
          </button>
        </div>
      ) : null;
    return this.props.children;
  }
}
export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => launcher.current?.focus());
  }
  if (process.env.NEXT_PUBLIC_AI_WIDGET_ENABLED === "false") return null;
  return (
    <>
      {!open && (
        <button
          ref={launcher}
          type="button"
          className="ai-launcher"
          aria-label="Ask Vardhan AI"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            setLoaded(true);
            setOpen(true);
          }}
        >
          <MessageCircle size={20} aria-hidden="true" />
          <span>Ask Vardhan AI</span>
        </button>
      )}
      {loaded && (
        <PanelBoundary open={open} onClose={() => close()}>
          <Suspense
            fallback={
              open ? (
                <div className="ai-loading-panel" role="status">
                  Loading portfolio assistant…{" "}
                  <button onClick={() => close()}>Close</button>
                </div>
              ) : null
            }
          >
            <Panel
              open={open}
              onClose={() => close()}
              onDismiss={() => close(false)}
            />
          </Suspense>
        </PanelBoundary>
      )}
    </>
  );
}
