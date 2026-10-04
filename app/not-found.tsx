"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, FolderGit2, Briefcase, User, Cpu } from "lucide-react";

interface QuoteVariant {
  title: string;
  subtitle: string;
  buttonText: string;
}

const QUOTE_VARIANTS: QuoteVariant[] = [
  {
    title: "you wandered off the path.",
    subtitle: "this branch doesn't exist, but the tree's still here.",
    buttonText: "return to the path",
  },
  {
    title: "nothing here but falling leaves.",
    subtitle: "seems like you drifted off into the breeze.",
    buttonText: "trace the leaves back",
  },
  {
    title: "lost in the void.",
    subtitle: "even the best paths lead nowhere sometimes.",
    buttonText: "escape the void",
  },
];

export default function NotFound() {
  const [variant, setVariant] = useState<QuoteVariant>(QUOTE_VARIANTS[0]);
  const [glitchText, setGlitchText] = useState("404");
  const isScrambling = useRef(false);

  const [blockedStatus, setBlockedStatus] = useState<string | null>(null);

  const triggerRustle = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tree:gust", { detail: { strength: 3.2, petals: 18 } }));
    }
  }, []);

  const scramble404 = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    triggerRustle();

    const glyphs = ["4", "0", "4", "Ø", "§", "!", "X", "†", "8", "9", "A", "#", "✿"];
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      if (frame > 12) {
        clearInterval(interval);
        setGlitchText("404");
        isScrambling.current = false;
      } else {
        const d1 = frame > 8 ? "4" : glyphs[Math.floor(Math.random() * glyphs.length)];
        const d2 = frame > 10 ? "0" : glyphs[Math.floor(Math.random() * glyphs.length)];
        const d3 = glyphs[Math.floor(Math.random() * glyphs.length)];
        setGlitchText(`${d1}${d2}${d3}`);
      }
    }, 45);
  }, [triggerRustle]);

  // Activate 404 mode in AsciiBackground and randomize quote on client mount (prevents SSR hydration error)
  useEffect(() => {
    setVariant(QUOTE_VARIANTS[Math.floor(Math.random() * QUOTE_VARIANTS.length)]);

    let timer: NodeJS.Timeout;
    const handleDomainBlocked = () => {
      clearTimeout(timer);
      setBlockedStatus("ERR // DOMAIN_EXPANSION_RESTRICTED: 0x404_SEVERED");
      scramble404();
      timer = setTimeout(() => {
        setBlockedStatus(null);
      }, 3200);
    };

    const handleSlashBlocked = () => {
      clearTimeout(timer);
      setBlockedStatus("ERR // SLASH_RESTRICTED: 0x404_SEVERED");
      scramble404();
      timer = setTimeout(() => {
        setBlockedStatus(null);
      }, 3200);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("tree:domain_blocked", handleDomainBlocked);
      window.addEventListener("tree:slash_blocked", handleSlashBlocked);
      window.dispatchEvent(new CustomEvent("tree:404_mode", { detail: { active: true } }));
      // Initial subtle rustle
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("tree:gust", { detail: { strength: 1.5, petals: 6 } }));
      }, 250);
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined") {
        window.removeEventListener("tree:domain_blocked", handleDomainBlocked);
        window.removeEventListener("tree:slash_blocked", handleSlashBlocked);
        window.dispatchEvent(new CustomEvent("tree:404_mode", { detail: { active: false } }));
      }
    };
  }, [scramble404]);

  const handle404Click = () => {
    triggerRustle();

    if (isScrambling.current) return;
    isScrambling.current = true;

    const corruptionSequence = ["0x404", "110010100", "4Ø4", "§404", "NULL", "斬!", "NaN", "404!"];
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      if (frame > 16) {
        clearInterval(interval);
        setGlitchText("404");
        isScrambling.current = false;
      } else {
        const word = corruptionSequence[frame % corruptionSequence.length];
        setGlitchText(word);
      }
    }, 40);
  };

  return (
    <section
      data-page-404="true"
      className="min-h-[calc(100vh-100px)] w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col justify-between relative z-20 select-none"
    >
      <title>404: Not Found</title>

      {/* Clean Terminal Status Header */}
      <div className="w-full flex items-center justify-between py-2 text-xs font-mono text-muted-textColor">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              blockedStatus ? "bg-red-500 animate-ping" : "bg-rose-500 animate-pulse"
            }`}
          />
          <span
            className={`transition-colors duration-200 ${
              blockedStatus
                ? "text-red-600 dark:text-red-400 font-bold tracking-wider"
                : "text-muted-textColor"
            }`}
          >
            {blockedStatus || "ERROR // 404-0xDEADLIFE(not_found)"}
          </span>
        </div>
        <span className="opacity-60 hidden sm:inline">err_route</span>
      </div>

      {/* Main Asymmetrical Stage */}
      <div className="my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Interactive Glitch-Scrambling 404 */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div
            onClick={handle404Click}
            onMouseEnter={scramble404}
            className="cursor-pointer group select-none relative"
            title="Click for reality burst, hover to scramble"
          >
            <h1
              className="font-mono text-8xl sm:text-9xl md:text-[11.5rem] lg:text-[13rem] font-bold tracking-tighter leading-none text-textColor transition-all duration-150 group-hover:scale-[1.03] group-active:scale-[0.98]"
              style={{
                textShadow:
                  "4px 0 0 rgba(225, 29, 72, 0.75), -3px 0 0 rgba(245, 158, 11, 0.5)",
              }}
            >
              {glitchText}
            </h1>
          </div>
        </div>

        {/* Right Column: Sleek Glassmorphic Quote Block */}
        <div className="lg:col-span-7 w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 transform-gpu p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-textColor leading-tight">
              {variant.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-textColor leading-relaxed max-w-xl">
              {variant.subtitle}
            </p>
          </div>

          {/* Primary Action Button — Linked with the Quote (Kinetic Beam & Tree Resonance) */}
          <div className="pt-2 w-full sm:w-auto">
            <Link
              href="/"  
              onMouseEnter={triggerRustle}
              onTouchStart={triggerRustle}
              onFocus={triggerRustle}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white font-mono text-sm font-semibold tracking-wide overflow-hidden shadow-sm hover:shadow-[0_0_24px_rgba(225,29,72,0.35)] transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 cursor-pointer"
            >
              {/* Specular sheen beam sweep on hover (no layout shift) */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none motion-reduce:hidden"
              />

              {/* Directional Icon with subtle retreat slide */}
              <span className="relative z-10 w-6 h-6 rounded-lg bg-black/15 flex items-center justify-center border border-white/15 transition-transform duration-200 ease-out group-hover:-translate-x-1 motion-reduce:transform-none">
                <ArrowLeft className="w-3.5 h-3.5 text-white/95 transition-colors" />
              </span>

              {/* Text with slight breath on hover */}
              <span className="relative z-10 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none">
                {variant.buttonText}
              </span>
            </Link>
          </div>

          {/* Clean Quick Teleport Terminal Chips */}
          <div className="pt-5 border-t border-border/40 w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-textColor flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/70" />
                teleport to section:
              </span>
              <span className="text-[10px] font-mono text-muted-textColor/50 tracking-wider hidden sm:inline">
                [nav_jump]
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              {[
                {
                  href: "/#projects",
                  label: "projects",
                  icon: FolderGit2,
                  iconHover: "group-hover:-translate-y-0.5",
                },
                {
                  href: "/#experience",
                  label: "experience",
                  icon: Briefcase,
                  iconHover: "group-hover:-rotate-6",
                },
                {
                  href: "/#skills",
                  label: "skills",
                  icon: Cpu,
                  iconHover: "group-hover:rotate-45",
                },
                {
                  href: "/#about",
                  label: "about",
                  icon: User,
                  iconHover: "group-hover:scale-105",
                },
              ].map(({ href, label, icon: Icon, iconHover }) => (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={triggerRustle}
                  className="group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/70 bg-card/50 hover:bg-rose-500/10 hover:border-rose-500/40 text-xs font-mono text-muted-textColor hover:text-textColor transition-all duration-200 overflow-hidden active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
                >
                  {/* Glowing left edge indicator that expands on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-rose-500 rounded-r-full transition-all duration-200 group-hover:h-3.5 group-hover:shadow-[0_0_8px_#f43f5e]"
                  />

                  {/* Contextual semantic icon */}
                  <Icon
                    className={`w-3.5 h-3.5 text-rose-500/80 group-hover:text-rose-400 transition-all duration-200 motion-reduce:transform-none ${iconHover}`}
                  />

                  {/* Label */}
                  <span>{label}</span>

                  {/* Terminal chevron */}
                  <span
                    aria-hidden="true"
                    className="text-[10px] text-muted-textColor/40 group-hover:text-rose-400/80 transition-colors font-mono"
                  >
                    /
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer Status */}
      <div className="w-full pt-4 text-xs font-mono text-muted-textColor/60 flex items-center justify-between">
        <span>terminal: dead</span>
        <span>tree: withering</span>
      </div>
    </section>
  );
}
