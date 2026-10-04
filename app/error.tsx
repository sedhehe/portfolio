"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertTriangle, FolderGit2, Briefcase, User, Cpu, Copy, Check } from "lucide-react";

/**
 * Root Error Boundary for Next.js App Router
 *
 * Catches runtime crashes, data fetching exceptions, or render failures gracefully.
 * Provides:
 * 1. Monospace ASCII diagnostics & error digest.
 * 2. Safe error retry (`reset()`) with kinetic feedback and tree resonance.
 * 3. Fallback navigation to home and primary portfolio sections.
 * 4. Anti-Vibe-Coded design standards: high contrast, strict 4pt/8pt rhythm, no glow slop.
 */

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const [glitchText, setGlitchText] = useState("500");
  const [copied, setCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const isScrambling = useRef(false);

  const triggerRustle = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tree:gust", { detail: { strength: 3.0, petals: 15 } })
      );
    }
  }, []);

  const scramble500 = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    triggerRustle();

    const glyphs = ["5", "0", "0", "Ø", "§", "!", "X", "†", "E", "R", "#", "✿"];
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      if (frame > 12) {
        clearInterval(interval);
        setGlitchText("500");
        isScrambling.current = false;
      } else {
        const d1 = frame > 8 ? "5" : glyphs[Math.floor(Math.random() * glyphs.length)];
        const d2 = frame > 10 ? "0" : glyphs[Math.floor(Math.random() * glyphs.length)];
        const d3 = glyphs[Math.floor(Math.random() * glyphs.length)];
        setGlitchText(`${d1}${d2}${d3}`);
      }
    }, 45);
  }, [triggerRustle]);

  useEffect(() => {
    // Report error to console in dev
    console.error("ErrorBoundary caught error:", error);

    // Tree resonates in withering mode for error diagnostics
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tree:404_mode", { detail: { active: true } }));
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("tree:gust", { detail: { strength: 2.0, petals: 12 } })
        );
      }, 200);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tree:404_mode", { detail: { active: false } }));
      }
    };
  }, [error]);

  const handleReset = () => {
    setIsRetrying(true);
    triggerRustle();
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 250);
  };

  const handleCopyDiagnostics = () => {
    const text = `Error: ${error.message}\nDigest: ${error.digest || "N/A"}\nStack: ${error.stack || "N/A"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[92vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Cyber-ASCII 500 Glitch Emblem */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center select-none text-center">
          <div
            onClick={scramble500}
            onMouseEnter={triggerRustle}
            role="button"
            tabIndex={0}
            aria-label="Glitch 500 glyph"
            className="group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-3xl p-6 transition-transform duration-300 active:scale-95"
          >
            <div
              className="text-8xl sm:text-9xl md:text-[11rem] font-mono font-black tracking-tighter leading-none transition-all duration-300 text-transparent bg-clip-text bg-gradient-to-br from-rose-600 via-amber-500 to-rose-400 group-hover:scale-[1.03]"
              style={{
                textShadow:
                  "0 0 35px rgba(225, 29, 72, 0.25), 0 0 70px rgba(245, 158, 11, 0.15)",
              }}
            >
              {glitchText}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 font-mono text-xs text-rose-500/80 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>FAULT // RUNTIME_INTERRUPT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Error Diagnostics & Recovery Actions */}
        <div className="lg:col-span-7 w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 transform-gpu p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-mono font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SYSTEM_FAULT_DETECTED</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-textColor leading-tight">
              a branch failed to load.
            </h1>
            <p className="text-base sm:text-lg text-muted-textColor leading-relaxed max-w-xl">
              An unexpected exception interrupted the render tree. You can retry re-rendering the branch or return to a known stable path.
            </p>
          </div>

          {/* Monospace Error Log Terminal */}
          <div className="w-full rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs text-left overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-muted-textColor">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>DIAGNOSTIC_TRACE</span>
              </span>
              <button
                type="button"
                onClick={handleCopyDiagnostics}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                title="Copy error details"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "copied" : "copy"}</span>
              </button>
            </div>
            <div className="text-rose-400 font-medium break-all">
              {error.message || "An unknown execution error occurred during route render."}
            </div>
            {error.digest && (
              <div className="mt-1.5 text-muted-textColor/70 text-[11px]">
                digest: {error.digest}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              disabled={isRetrying}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white font-mono text-sm font-semibold tracking-wide overflow-hidden shadow-sm hover:shadow-[0_0_24px_rgba(225,29,72,0.35)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              <span>{isRetrying ? "re-initializing..." : "retry connection"}</span>
            </button>

            <Link
              href="/"
              onMouseEnter={triggerRustle}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-foreground/10 hover:bg-foreground/20 text-textColor font-mono text-sm font-medium border border-border/50 transition-all duration-200 active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4 text-muted-textColor" />
              <span>return to home</span>
            </Link>
          </div>

          {/* Quick Teleport Chips */}
          <div className="pt-5 border-t border-border/40 w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-textColor flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/70" />
                teleport to stable section:
              </span>
              <span className="text-[10px] font-mono text-muted-textColor/50 tracking-wider hidden sm:inline">
                [nav_jump]
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              {[
                { href: "/#projects", label: "projects", icon: FolderGit2 },
                { href: "/#experience", label: "experience", icon: Briefcase },
                { href: "/#skills", label: "skills", icon: Cpu },
                { href: "/#about", label: "about", icon: User },
              ].map((chip) => {
                const Icon = chip.icon;
                return (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    onMouseEnter={triggerRustle}
                    className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10 hover:bg-rose-500/10 border border-textColor/10 dark:border-white/5 hover:border-rose-500/30 text-xs font-mono text-muted-textColor hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200 cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-textColor group-hover:text-rose-500 transition-colors" />
                    <span>{chip.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
