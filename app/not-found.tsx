"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

  const triggerRustle = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("tree:gust", {
        detail: { strength: 3.2, petals: 18 },
      })
    );
  }, []);

  const randomizeQuote = useCallback(() => {
    setVariant((currentVariant) => {
      const currentIndex = QUOTE_VARIANTS.indexOf(currentVariant);
      const offset =
        1 + Math.floor(Math.random() * (QUOTE_VARIANTS.length - 1));

      return QUOTE_VARIANTS[
        (currentIndex + offset) % QUOTE_VARIANTS.length
      ];
    });
  }, []);

  const scramble404 = useCallback(() => {
    if (isScrambling.current) return;

    isScrambling.current = true;
    triggerRustle();

    const glyphs = [
      "4", "0", "4", "Ø", "§", "!", "X", "†", "8", "9", "A", "#", "✿",
    ];

    let frame = 0;

    const interval = setInterval(() => {
      frame++;

      if (frame > 12) {
        clearInterval(interval);
        setGlitchText("404");
        isScrambling.current = false;
      } else {
        const d1 =
          frame > 8
            ? "4"
            : glyphs[Math.floor(Math.random() * glyphs.length)];

        const d2 =
          frame > 10
            ? "0"
            : glyphs[Math.floor(Math.random() * glyphs.length)];

        const d3 = glyphs[Math.floor(Math.random() * glyphs.length)];

        setGlitchText(`${d1}${d2}${d3}`);
      }
    }, 45);
  }, [triggerRustle]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleDomainBlocked = () => {
      if (timer) clearTimeout(timer);

      scramble404();

      timer = setTimeout(() => {
        timer = undefined;
      }, 3200);
    };

    const handleSlashBlocked = () => {
      if (timer) clearTimeout(timer);

      scramble404();

      timer = setTimeout(() => {
        timer = undefined;
      }, 3200);
    };

    window.addEventListener("tree:domain_blocked", handleDomainBlocked);
    window.addEventListener("tree:slash_blocked", handleSlashBlocked);

    window.dispatchEvent(
      new CustomEvent("tree:404_mode", {
        detail: { active: true },
      })
    );

    const rustleTimer = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("tree:gust", {
          detail: { strength: 1.5, petals: 6 },
        })
      );
    }, 250);

    return () => {
      if (timer) clearTimeout(timer);
      clearTimeout(rustleTimer);

      window.removeEventListener(
        "tree:domain_blocked",
        handleDomainBlocked
      );

      window.removeEventListener(
        "tree:slash_blocked",
        handleSlashBlocked
      );

      window.dispatchEvent(
        new CustomEvent("tree:404_mode", {
          detail: { active: false },
        })
      );
      window.dispatchEvent(
        new CustomEvent("tree:sweep_404_leaves", {
          detail: { strength: 8.5, spawnCount: 35 },
        })
      );
    };
  }, [scramble404]);

  const handle404Click = () => {
    randomizeQuote();
    triggerRustle();

    if (isScrambling.current) return;

    isScrambling.current = true;

    const corruptionSequence = [
      "0x404",
      "110010100",
      "4Ø4",
      "§404",
      "NULL",
      "斬!",
      "NaN",
      "404!",
    ];

    let frame = 0;

    const interval = setInterval(() => {
      frame++;

      if (frame > 16) {
        clearInterval(interval);
        setGlitchText("404");
        isScrambling.current = false;
      } else {
        const word =
          corruptionSequence[frame % corruptionSequence.length];

        setGlitchText(word);
      }
    }, 40);
  };

  const handleRedirectClick = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tree:sweep_404_leaves", {
          detail: { strength: 8.5, spawnCount: 35 },
        })
      );
    }
  }, []);

  return (
    <section
      data-page-404="true"
      className="min-h-[calc(100vh-100px)] w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col justify-between relative z-20 select-none"
    >
      <title>404: Not Found</title>

      {/* Clean Terminal Status Header */}
      <p className="font-mono text-xs uppercase tracking-widest text-destructive font-semibold mb-5">
        {"// 404. Route Not Found"}
      </p>

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

        {/* Right Column: Glassmorphic Quote Block */}
        <div className="lg:col-span-7 w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 transform-gpu p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-textColor leading-tight">
              {variant.title}
            </h2>

            <p className="text-base sm:text-lg text-muted-textColor leading-relaxed max-w-xl">
              {variant.subtitle}
            </p>
          </div>

          {/* Return Home */}
          <div className="pt-2 w-full sm:w-auto">
            <Link
              href="/"
              onClick={handleRedirectClick}
              onMouseEnter={triggerRustle}
              onTouchStart={triggerRustle}
              onFocus={triggerRustle}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-7 py-3.5 rounded-xl bg-textColor/[0.06] hover:bg-textColor/[0.15] text-textColor border border-textColor/20 hover:border-rose-500 text-base font-semibold font-mono tracking-wide overflow-hidden shadow-sm hover:shadow-[0_0_24px_rgba(225,29,72,0.35)] transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 cursor-pointer"
            >
              <span className="relative z-10 w-6 h-6 rounded-lg bg-black/15 flex items-center justify-center border border-white/15 transition-transform duration-200 ease-out group-hover:-translate-x-1 motion-reduce:transform-none">
                <ArrowLeft className="w-3.5 h-3.5 text-textColor/95 group-hover:text-rose-500 transition-colors" />
              </span>

              <span className="relative z-10 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none">
                {variant.buttonText}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}