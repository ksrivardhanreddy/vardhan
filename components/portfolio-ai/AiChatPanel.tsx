"use client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { ArrowUpRight, Send, Trash2, X } from "lucide-react";
import { search } from "@/lib/portfolio-ai/search";
import { composeAnswer } from "@/lib/portfolio-ai/extractive-answer";
import { safeSourceUrl, validateIndex } from "@/lib/portfolio-ai/privacy";
import type {
  Answer,
  KnowledgeIndex,
  UiMessage,
} from "@/lib/portfolio-ai/types";
import { freshToken } from "./turnstile";
const suggestions = [
  "What Kubernetes projects has Vardhan built?",
  "How has Vardhan used AWS and Terraform?",
  "What does his homelab architecture include?",
  "What is Vardhan learning about AI platforms?",
];
let cachedIndex: Promise<KnowledgeIndex> | undefined;
function loadIndex() {
  if (!cachedIndex)
    cachedIndex = fetch("/knowledge-base/index.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Content unavailable");
        const data: unknown = await response.json();
        if (!validateIndex(data)) throw new Error("Content unavailable");
        return data;
      })
      .catch((error) => {
        cachedIndex = undefined;
        throw error;
      });
  return cachedIndex;
}
export default function AiChatPanel({
  open,
  onClose,
  onDismiss,
}: {
  open: boolean;
  onClose: () => void;
  onDismiss: () => void;
}) {
  const [messages, setMessages] = useState<UiMessage[]>([]),
    [question, setQuestion] = useState(""),
    [index, setIndex] = useState<KnowledgeIndex | null>(null),
    [loadError, setLoadError] = useState(false),
    [busy, setBusy] = useState(false),
    [useAi, setUseAi] = useState(false),
    [notice, setNotice] = useState("");
  const panel = useRef<HTMLDivElement>(null),
    input = useRef<HTMLTextAreaElement>(null),
    list = useRef<HTMLDivElement>(null),
    verification = useRef<HTMLDivElement>(null),
    pending = useRef<AbortController | null>(null),
    sending = useRef(false),
    alive = useRef(true);
  const remoteAvailable =
    process.env.NEXT_PUBLIC_AI_ASSISTANT_ENABLED === "true" &&
    !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      pending.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    let active = true;
    loadIndex()
      .then((data) => {
        if (active) {
          setIndex(data);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [open]);
  useEffect(() => {
    if (!open) {
      pending.current?.abort();
      return;
    }
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    function keydown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], textarea, input:not(:disabled), [tabindex="0"]',
        ) ?? [],
      ).filter((e) => e.getClientRects().length);
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    function outsideClick(event: Event) {
      if (!panel.current?.contains(event.target as Node)) onDismiss();
    }
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", outsideClick, true);
    document.addEventListener("click", outsideClick, true);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", outsideClick, true);
      document.removeEventListener("click", outsideClick, true);
      previous?.focus();
    };
  }, [open, onClose, onDismiss]);
  useEffect(() => {
    list.current?.scrollTo({
      top: list.current.scrollHeight,
      behavior: "auto",
    });
  }, [messages, busy]);
  async function ask(value: string) {
    const text = value.trim();
    if (!text || text.length > 500 || sending.current || !index) return;
    sending.current = true;
    setBusy(true);
    setNotice("");
    setQuestion("");
    const controller = new AbortController();
    pending.current = controller;
    setMessages((m) =>
      [
        ...m,
        { id: crypto.randomUUID(), role: "user" as const, content: text },
      ].slice(-30),
    );
    let answer: Answer = composeAnswer(index, text);
    const retrieval = search(index, text);
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      if (
        useAi &&
        remoteAvailable &&
        retrieval.results.length &&
        !retrieval.direct &&
        verification.current
      ) {
        const token = await freshToken(
          verification.current,
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          controller.signal,
        );
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text, turnstileToken: token }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("AI unavailable");
        const data = (await response.json()) as Answer;
        // Server metadata must still correspond to this deployment's known canonical corpus.
        if (
          !["ai", "knowledge"].includes(data.mode) ||
          typeof data.answer !== "string" ||
          data.answer.length > 1600 ||
          !Array.isArray(data.sources) ||
          data.sources.length > 3 ||
          !data.sources.every(
            (source) =>
              safeSourceUrl(source.url) &&
              index.chunks.some(
                (chunk) => chunk.id === source.id && chunk.url === source.url,
              ),
          )
        )
          throw new Error("Invalid response");
        answer = data;
      }
    } catch {
      if (alive.current)
        setNotice(
          "Showing portfolio excerpts while AI phrasing is unavailable.",
        );
    } finally {
      clearTimeout(timer);
      sending.current = false;
      pending.current = null;
      if (alive.current) {
        setMessages((m) =>
          [
            ...m,
            {
              id: crypto.randomUUID(),
              role: "assistant" as const,
              content: answer.answer,
              mode: answer.mode,
              sources: answer.sources,
            },
          ].slice(-30),
        );
        setBusy(false);
        if (open) input.current?.focus();
      }
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }
  function inputKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void ask(question);
    }
  }
  if (!open) return null;
  return (
    <div className="ai-backdrop">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-title"
        className="ai-panel"
      >
        <header className="ai-header">
          <div>
            <p className="ai-eyebrow">PORTFOLIO ASSISTANT</p>
            <h2 id="ai-title">Ask Vardhan AI</h2>
          </div>
          <div className="ai-header-actions">
            <button
              type="button"
              aria-label="Clear chat"
              disabled={busy}
              onClick={() => {
                setMessages([]);
                setNotice("");
                input.current?.focus();
              }}
            >
              <Trash2 size={18} />
            </button>
            <button
              type="button"
              aria-label="Close assistant"
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>
        </header>
        <div
          ref={list}
          className="ai-messages"
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          aria-relevant="additions"
          tabIndex={0}
        >
          {!messages.length && (
            <div className="ai-welcome">
              <p id="ai-description">
                Ask about my experience, projects, skills or learning.
              </p>
              <div className="ai-suggestions">
                {suggestions.map((prompt) => (
                  <button
                    key={prompt}
                    disabled={!index || busy}
                    onClick={() => void ask(prompt)}
                  >
                    {prompt}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <p className="ai-trust">
                {remoteAvailable
                  ? "Answers use published content. Optional AI phrasing uses Cloudflare."
                  : "Knowledge-only: answers come from published portfolio content."}{" "}
                Please don’t enter confidential information.{" "}
                <Link href="/#contact" onClick={onClose}>
                  Contact Vardhan
                </Link>
              </p>
            </div>
          )}
          {messages.map((message) => (
            <article
              key={message.id}
              className={`ai-message ai-message-${message.role}`}
            >
              <p className="ai-message-label">
                {message.role === "user"
                  ? "You"
                  : message.mode === "ai"
                    ? "AI-assisted"
                    : "From portfolio content"}
              </p>
              <p className="ai-message-text">{message.content}</p>
              {!!message.sources?.length && (
                <nav aria-label="Answer sources" className="ai-sources">
                  <p>Sources</p>
                  <ul>
                    {message.sources.map((source) => (
                      <li key={source.id}>
                        <a
                          href={source.url}
                          onClick={
                            source.url.startsWith("/") ? onClose : undefined
                          }
                          {...(source.url.startsWith("https:")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </article>
          ))}
          {busy && <p role="status">Finding published evidence…</p>}
        </div>
        <div className="ai-status" role="status">
          {loadError ? (
            <>
              Portfolio content could not load. Check your connection and{" "}
              <button
                onClick={() => {
                  cachedIndex = undefined;
                  loadIndex()
                    .then((data) => {
                      setIndex(data);
                      setLoadError(false);
                    })
                    .catch(() => setLoadError(true));
                }}
              >
                Retry loading content
              </button>
              .
            </>
          ) : !index ? (
            "Loading published portfolio content…"
          ) : (
            notice
          )}
        </div>
        <form className="ai-form" onSubmit={submit}>
          {remoteAvailable && (
            <label className="ai-opt-in">
              <input
                type="checkbox"
                checked={useAi}
                onChange={(event) => setUseAi(event.target.checked)}
                disabled={busy}
              />{" "}
              Use AI phrasing via Cloudflare
            </label>
          )}
          <div ref={verification} className="ai-verification" />
          <label htmlFor="ai-question">Your portfolio question</label>
          <textarea
            ref={input}
            id="ai-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={inputKey}
            maxLength={500}
            rows={2}
            placeholder="Ask about projects, skills or experience…"
            disabled={busy}
          />
          <div className="ai-form-footer">
            <span>{question.length}/500 · Shift+Enter for a new line</span>
            <button
              type="submit"
              disabled={!question.trim() || busy || !index}
              aria-label="Send question"
            >
              <Send size={17} />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
