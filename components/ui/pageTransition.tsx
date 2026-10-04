"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, WifiOff } from "lucide-react";

/**
 * PageTransition — Kinetic Wind Gust Page Transition & Living Splash Loading Screen
 *
 * Fast, responsive wind transition with comprehensive error resilience:
 * 1. Fast Snappy Beginning (Departure):
 *    - Instant gust strikes tree (`tree:gust`), sweeping away floating particles.
 *    - Speedlines and petals storm across on top (z-[9999]) with brisk velocity.
 *    - Full-bleed veil fades in swiftly (~140ms).
 *    - Route push initiated in parallel at 40ms.
 * 2. Living Splash Loading ("Stuck on the wave"):
 *    - If the target page is still compiling, fetching data, or rendering, the screen stays veiled
 *      while petals and wind streaks continuously loop across dynamically like an anime splash screen.
 * 3. Entering (Arrival Reveal):
 *    - As soon as the new page is painted (verified via double RAF), veil dissolves swiftly (~160ms).
 *    - Fresh flurry of particles sweeps across ON TOP of the newly rendered layout.
 * 4. Error & Network Resilience:
 *    - Watchdog fallback: auto-navigates via window.location.href if client-side router stalls (>2.8s).
 *    - Safety unveil: aborts veil after 3.8s so the user is never trapped behind an opaque screen.
 *    - ChunkLoadError listener: catches stale/broken client chunks and forces hard browser reload.
 *    - Offline detector: detects lost network connection and safely unveils with HUD status notice.
 */

interface LivePetal {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  sinOffset: number;
}

interface LiveStreak {
  x: number;
  y: number;
  speed: number;
  len: number;
  width: number;
  color?: string;
}

const TEMPEST_GLYPHS = ["✿", "❀", "🌸", "🍂", "*", "~", "+", "·", "•", "░", "°"];

const getPetalPalette = (is404: boolean, isLight: boolean) => {
  if (isLight) {
    // Light mode: Red, Blue, and White/Slate (the palette that worked well)
    return is404
      ? ["#e11d48", "#dc2626", "#ea580c", "#d97706", "#db2777", "#475569"]
      : ["#0284c7", "#0ea5e9", "#e11d48", "#f472b6", "#334155"];
  } else {
    // Dark mode: Red, Blue, and White on Black
    return is404
      ? ["#ff4d6d", "#ef4444", "#f97316", "#fb7185", "#fda4af", "#ffffff"]
      : [
          "#05acff", // electric cyan blue
          "#ff0044", // vivid crimson red
          "#38bdf8", // luminous sky blue
          "#ff4d6d", // neon rose red
          "#ade1ff", // pale starlight blue
          "#ffffff"  // brilliant white
        ];
  }
};

const spawnPetal = (
  w: number,
  h: number,
  palette: string[],
  initialX?: number
): LivePetal => {
  const baseY = h * 0.1 + Math.random() * (h * 0.8);
  const x = initialX !== undefined ? initialX : -20 - Math.random() * (w * 0.2);
  // High velocity in pixels per millisecond (~6.5 to 13.0 px/ms on 1800px screen)
  const vx = (w * 0.0036) + Math.random() * (w * 0.0036);
  const vy = (Math.random() - 0.46) * 1.8;

  return {
    x,
    y: baseY,
    baseY,
    vx,
    vy,
    char: TEMPEST_GLYPHS[Math.floor(Math.random() * TEMPEST_GLYPHS.length)],
    color: palette[Math.floor(Math.random() * palette.length)],
    size: Math.floor(Math.random() * 8 + 14),
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.48) * 0.22,
    sinOffset: Math.random() * Math.PI * 2,
  };
};

const spawnStreak = (
  w: number,
  h: number,
  isLight: boolean,
  initialX?: number
): LiveStreak => {
  let color: string;
  if (isLight) {
    // Light mode: Clean cerulean blue speedlines (what worked well)
    color = "rgba(2, 132, 199, 0.4)";
  } else {
    // Dark mode: Dual clash of Electric Blue & Crimson Red cutting through the deep black void
    color = Math.random() > 0.5 ? "rgba(5, 172, 255, 0.65)" : "rgba(255, 0, 68, 0.65)";
  }

  return {
    x: initialX !== undefined ? initialX : -80 - Math.random() * (w * 0.15),
    y: Math.random() * h,
    speed: (w * 0.0048) + Math.random() * (w * 0.004),
    len: Math.random() * 220 + 140,
    width: Math.random() * 1.6 + 0.8,
    color,
  };
};

type TransitionState = "IDLE" | "ENTERING" | "LOADING" | "EXITING";

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const stateRef = useRef<TransitionState>("IDLE");
  const exitStartRef = useRef<number>(0);
  const pendingExitRef = useRef<boolean>(false);
  const targetHrefRef = useRef<string | null>(null);
  const hasFallbackNavigatedRef = useRef<boolean>(false);

  // HUD toast notification for network errors or watchdog timeouts
  const [errorNotice, setErrorNotice] = useState<{ msg: string; isOffline?: boolean } | null>(null);

  // Active particle and streak pools
  const petalsRef = useRef<LivePetal[]>([]);
  const streaksRef = useRef<LiveStreak[]>([]);

  const triggerArrivalWave = useCallback((targetPath: string) => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : window.innerWidth;
    const h = canvas ? canvas.height : window.innerHeight;

    const isLight =
      window.matchMedia("(prefers-color-scheme: light)").matches ||
      getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim() === "#fff";

    const isNew404 = targetPath !== "/" && !targetPath.startsWith("/#");
    const palette = getPetalPalette(isNew404, isLight);

    // Spawn arrival flurry clustered at the left edge to sweep across on top of the new page
    const count = Math.min(90, Math.max(45, Math.floor(w / 20)));
    const arrivalPetals: LivePetal[] = [];
    for (let i = 0; i < count; i++) {
      arrivalPetals.push(spawnPetal(w, h, palette, -15 - Math.random() * (w * 0.2)));
    }
    petalsRef.current = arrivalPetals;

    const arrivalStreaks: LiveStreak[] = [];
    for (let i = 0; i < 20; i++) {
      arrivalStreaks.push(spawnStreak(w, h, isLight, -60 - Math.random() * (w * 0.15)));
    }
    streaksRef.current = arrivalStreaks;

    // Trigger synchronized arrival wind gust on the new tree
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tree:gust", { detail: { strength: 10.0, petals: 30 } })
      );
    }

    stateRef.current = "EXITING";
    exitStartRef.current = performance.now();
    pendingExitRef.current = false;
  }, []);

  const safeAbortTransition = useCallback((reason: string, isOffline = false) => {
    stateRef.current = "EXITING";
    exitStartRef.current = performance.now();
    setErrorNotice({ msg: reason, isOffline });

    setTimeout(() => {
      setErrorNotice(null);
    }, 4500);
  }, []);

  const startTransition = useCallback(
    (targetHref: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      targetHrefRef.current = targetHref;
      hasFallbackNavigatedRef.current = false;
      stateRef.current = "ENTERING";
      pendingExitRef.current = false;
      canvas.style.display = "block";

      // Check online status immediately
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        safeAbortTransition("Navigation aborted: Offline", true);
        return;
      }

      // Trigger gale on current tree to sweep away floating particles
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("tree:gust", { detail: { strength: 14.0, petals: 45 } })
        );
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      const isLight =
        window.matchMedia("(prefers-color-scheme: light)").matches ||
        getComputedStyle(document.documentElement)
          .getPropertyValue("--background")
          .trim() === "#fff";

      const isCurrent404 =
        window.location.pathname !== "/" && !window.location.pathname.startsWith("/#");

      const veilColor = isLight ? "rgba(248, 250, 252, 0.98)" : "rgba(10, 10, 14, 0.98)";
      const streakColor = isLight ? "rgba(2, 132, 199, 0.4)" : "rgba(5, 172, 255, 0.65)";
      const palette = getPetalPalette(isCurrent404, isLight);

      // Initialize departure wave with fast initial velocity
      const count = Math.min(90, Math.max(45, Math.floor(w / 20)));
      const departurePetals: LivePetal[] = [];
      for (let i = 0; i < count; i++) {
        departurePetals.push(spawnPetal(w, h, palette, -20 - Math.random() * (w * 0.2)));
      }
      petalsRef.current = departurePetals;

      const departureStreaks: LiveStreak[] = [];
      for (let i = 0; i < 20; i++) {
        departureStreaks.push(spawnStreak(w, h, isLight, -60 - Math.random() * (w * 0.15)));
      }
      streaksRef.current = departureStreaks;

      // Fast, snappy departure timings
      const enterDuration = 140; // ms: veil fades in swiftly
      const exitDuration = 320;  // ms: veil dissolves in 160ms, arrival particles settle in 320ms
      const startTime = performance.now();
      let lastTime = startTime;
      let hasPushed = false;

      const animate = (now: number) => {
        const dt = Math.min(33, Math.max(1, now - lastTime));
        lastTime = now;
        const elapsed = now - startTime;
        ctx.clearRect(0, 0, w, h);

        // Initiate parallel route load early at 40ms
        if (!hasPushed && elapsed >= 40) {
          hasPushed = true;
          try {
            router.push(targetHref);
          } catch (err) {
            console.error("Router push exception:", err);
            window.location.href = targetHref;
            return;
          }
        }

        // State Machine transitions
        if (stateRef.current === "ENTERING") {
          if (elapsed >= enterDuration) {
            if (pendingExitRef.current) {
              triggerArrivalWave(window.location.pathname);
            } else {
              // Enter living splash loading wave while waiting for route render
              stateRef.current = "LOADING";
            }
          }
        }

        // Error Watchdog: Fallback hard navigation if client router stalls > 2800ms
        if (stateRef.current === "LOADING" && elapsed > 2800 && !hasFallbackNavigatedRef.current) {
          hasFallbackNavigatedRef.current = true;
          console.warn("Client navigation stalled; attempting hard window navigation to:", targetHref);
          window.location.href = targetHref;
        }

        // Safety Unveil: Abort veil if navigation completely fails > 3800ms
        if (stateRef.current === "LOADING" && elapsed > 3800) {
          safeAbortTransition("Navigation timed out. Returning to current view.");
          return;
        }

        // Calculate veil opacity
        let veilAlpha = 0;
        if (stateRef.current === "ENTERING") {
          const enterProg = Math.min(1, elapsed / enterDuration);
          veilAlpha = enterProg * enterProg * (3 - 2 * enterProg); // smooth cubic
        } else if (stateRef.current === "LOADING") {
          veilAlpha = 1.0;
        } else if (stateRef.current === "EXITING") {
          const exitElapsed = now - exitStartRef.current;
          const veilProg = Math.min(1, exitElapsed / 160);
          const veilEase = veilProg * veilProg * (3 - 2 * veilProg);
          veilAlpha = Math.max(0, 1 - veilEase);
        }

        // 1. Draw Full-Bleed Atmospheric Veil
        if (veilAlpha > 0.005) {
          ctx.save();
          ctx.globalAlpha = veilAlpha;
          ctx.fillStyle = veilColor;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
        }

        // 2. Update & Draw Speedlines ON TOP (scaled in real ms velocity)
        const activeStreaks = streaksRef.current;
        ctx.save();
        ctx.strokeStyle = streakColor;
        for (let i = 0; i < activeStreaks.length; i++) {
          const s = activeStreaks[i];
          s.x += s.speed * dt;

          // Continuous loop during LOADING state ("stuck on the wave")
          if (stateRef.current === "LOADING" && s.x > w + s.len) {
            s.x = -s.len - Math.random() * 80;
            s.y = Math.random() * h;
          }

          if (s.x > -s.len && s.x < w + s.len) {
            ctx.lineWidth = s.width;
            let streakAlpha = 0.55;
            if (stateRef.current === "EXITING") {
              const exitElapsed = now - exitStartRef.current;
              streakAlpha = Math.max(0.05, (1 - exitElapsed / exitDuration) * 0.55);
            }
            ctx.globalAlpha = streakAlpha;
            ctx.strokeStyle = s.color || streakColor;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + s.len, s.y);
            ctx.stroke();
          }
        }
        ctx.restore();

        // 3. Update & Draw Wind-Carried Petals ON TOP (scaled in real ms velocity)
        const activePetals = petalsRef.current;
        ctx.save();
        for (let i = 0; i < activePetals.length; i++) {
          const p = activePetals[i];
          p.x += p.vx * dt;
          p.rotation += p.rotSpeed * (dt / 16.67);
          p.y = p.baseY + Math.sin(now * 0.005 + p.sinOffset) * 12;

          // Continuous loop during LOADING state ("stuck on the wave")
          if (stateRef.current === "LOADING" && p.x > w + 40) {
            p.x = -30 - Math.random() * 70;
            p.baseY = h * 0.1 + Math.random() * (h * 0.8);
            p.char = TEMPEST_GLYPHS[Math.floor(Math.random() * TEMPEST_GLYPHS.length)];
          }

          if (p.x < -40 || p.x > w + 60) continue;

          let particleAlpha = 0.95;
          if (stateRef.current === "ENTERING") {
            particleAlpha = Math.min(0.95, Math.max(0.2, veilAlpha * 1.25));
          } else if (stateRef.current === "EXITING") {
            const exitElapsed = now - exitStartRef.current;
            const progress = Math.min(1, exitElapsed / exitDuration);
            particleAlpha = Math.min(0.95, Math.max(0.12, 1 - progress * 0.7));
          }

          ctx.save();
          ctx.globalAlpha = particleAlpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.font = `bold ${p.size}px "Source Code Pro", monospace`;
          ctx.fillStyle = p.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        }
        ctx.restore();

        // Check completion in EXITING state
        if (stateRef.current === "EXITING") {
          const exitElapsed = now - exitStartRef.current;
          if (exitElapsed >= exitDuration) {
            stateRef.current = "IDLE";
            ctx.clearRect(0, 0, w, h);
            canvas.style.display = "none";
            return;
          }
        }

        animFrameRef.current = requestAnimationFrame(animate);
      };

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [router, triggerArrivalWave, safeAbortTransition]
  );

  // Global error, chunk failure, and offline event listeners
  useEffect(() => {
    const handleChunkError = (e: ErrorEvent | PromiseRejectionEvent) => {
      const msg = "reason" in e ? String(e.reason) : e.message;
      if (
        msg &&
        (msg.includes("ChunkLoadError") ||
          msg.includes("Loading chunk") ||
          msg.includes("Failed to fetch") ||
          msg.includes("NetworkError"))
      ) {
        console.warn("Detected client chunk error during navigation:", msg);
        if (targetHrefRef.current && (stateRef.current === "LOADING" || stateRef.current === "ENTERING")) {
          window.location.href = targetHrefRef.current;
        }
      }
    };

    const handleOffline = () => {
      if (stateRef.current === "LOADING" || stateRef.current === "ENTERING") {
        safeAbortTransition("Network disconnected: You are offline.", true);
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleChunkError);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleChunkError);
      window.removeEventListener("offline", handleOffline);
    };
  }, [safeAbortTransition]);

  // Intercept navigation clicks globally so transition begins on CURRENT page
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href) return;

      const currentOrigin = window.location.origin;
      if (!anchor.href.startsWith(currentOrigin) && !anchor.href.startsWith("/")) return;

      const targetUrl = new URL(anchor.href, currentOrigin);

      // Only intercept when navigating to a different pathname
      if (targetUrl.pathname !== window.location.pathname) {
        e.preventDefault();
        e.stopPropagation();

        const targetHref = targetUrl.pathname + targetUrl.search + targetUrl.hash;
        startTransition(targetHref);
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [startTransition]);

  // When pathname updates (new route mounted), verify paint before dissolving the wave
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      // Double requestAnimationFrame ensures React has committed and the browser has painted the new DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (stateRef.current === "LOADING") {
            triggerArrivalWave(pathname);
          } else if (stateRef.current === "ENTERING") {
            pendingExitRef.current = true;
          }
        });
      });
    }
  }, [pathname, triggerArrivalWave]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{ willChange: "transform, opacity", display: "none" }}
        aria-hidden="true"
      />

      {/* Non-blocking Diagnostics HUD for navigation errors or network disconnects */}
      {errorNotice && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-rose-500/40 text-white font-mono text-xs flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          {errorNotice.isOffline ? (
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="text-slate-200">{errorNotice.msg}</span>
          <button
            type="button"
            onClick={() => setErrorNotice(null)}
            className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-bold"
          >
            [dismiss]
          </button>
        </aside>
      )}
    </>
  );
}
