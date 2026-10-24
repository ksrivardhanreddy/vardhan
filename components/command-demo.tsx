"use client";

import { useEffect, useRef, useState } from "react";

type Demo = { command: string; output: string[] };
export function CommandDemo({
  command,
  output,
  paused,
}: Demo & { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      query.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);
  const typingTicks = command.length;
  const totalTicks = typingTicks + output.length * 7 + 65;
  useEffect(() => {
    if (!visible || paused || reducedMotion) return;
    const timer = window.setInterval(
      () => setTick((value) => (value + 1) % totalTicks),
      65,
    );
    return () => window.clearInterval(timer);
  }, [visible, paused, reducedMotion, totalTicks]);
  const complete = reducedMotion || paused;
  const text = complete
    ? command
    : command.slice(0, Math.min(tick, typingTicks));
  const lines = complete
    ? output.length
    : Math.max(0, Math.floor((tick - typingTicks) / 7));
  return (
    <div ref={ref} className="command-demo">
      <div className="command-caption">
        Illustrative Command <span>Demo</span>
      </div>
      <div aria-hidden="true" className="command-screen">
        <p className="command-input">
          <span>❯</span>{" "}
          <span>
            {text}
            <i className="cursor" />
          </span>
        </p>
        <div className="command-output">
          {output.map((line, index) => (
            <p
              key={line}
              className={
                index < lines ? "output-line is-visible" : "output-line"
              }
            >
              <span>✓</span> {line}
            </p>
          ))}
        </div>
      </div>
      <p className="sr-only">
        Example command: {command}. Example output: {output.join(". ")}. This is
        an illustration, not a live system.
      </p>
    </div>
  );
}
export const commandDemos: Demo[] = [
  {
    command: "terraform plan",
    output: [
      "Configuration validated",
      "Plan ready for review",
      "Production approval required",
    ],
  },
  {
    command: "kubectl get pods",
    output: [
      "api-server   1/1   Running",
      "worker       1/1   Running",
      "Workloads ready for inspection",
    ],
  },
  {
    command: "kubectl get svc opencost",
    output: [
      "Service: opencost",
      "Cluster metrics available",
      "Ready to explore allocation",
    ],
  },
];
