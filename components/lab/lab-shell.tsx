"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
export function LabShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="portfolio lab-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-inner lab-nav">
          <Link className="wordmark" href="/" aria-label="Vardhan home">
            V<span className="orange">.</span>
            <span className="wordmark-name">
              Vardhan<span className="code-muted"> / </span>Pro
            </span>
          </Link>
          <nav aria-label="Engineering Lab navigation">
            <Link href="/lab">Engineering Lab</Link>
            <Link href="/#work">Professional Work</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          <button
            className="icon-button"
            aria-label={
              mounted && resolvedTheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {mounted && resolvedTheme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>
        </div>
      </header>
      {children}
      <footer className="site-footer section-shell">
        <Link href="/lab">Engineering Lab</Link>
        <Link href="/">Back to Portfolio</Link>
        <a href="/resume.pdf" download>
          Download Résumé
        </a>
        <a href="#main">Back to Top ↑</a>
      </footer>
    </div>
  );
}
