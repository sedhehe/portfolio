"use client";

import { useEffect } from "react";

/**
 * Global Error Boundary for Next.js App Router
 * Catches root layout exceptions, rendering a minimalist fallback HTML.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("GlobalError caught root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#080c14] text-[#f8fafc] min-h-screen flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 text-center">
          <div className="text-4xl font-bold text-rose-500 tracking-wider">
            [0x500_PANIC]
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The root layout encountered a critical execution fault.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              RE-INITIALIZE ENVIRONMENT
            </button>
            <a
              href="/"
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium tracking-wider transition-colors"
            >
              RETURN TO ROOT
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
