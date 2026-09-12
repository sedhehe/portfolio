"use client";

import { motion } from "motion/react";
import React from "react";

export interface ExpItemProps {
  readonly index: number;
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly isActive?: boolean;
  readonly onBulletClick?: () => void;
  readonly stack: string[];
  readonly bullets: string[];
}

export default function ExpCard({
  index,
  role,
  company,
  period,
  isActive,
  onBulletClick,
  stack,
  bullets,
}: ExpItemProps) {
  return (
    <motion.div
      id={`exp-card-${index}`}
      className="relative pl-8 sm:pl-10 pb-12 last:pb-2 group scroll-mt-32"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Vertical Spine Line */}
      <div
        className="absolute left-[7px] sm:left-[9px] top-3 bottom-0 w-px bg-black/15 dark:bg-textColor/15 group-last:hidden"
        aria-hidden="true"
      />

      {/* Interactive Milestone Node / Bullet */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onBulletClick?.();
        }}
        aria-label={`Scroll to ${role} at ${company}`}
        style={{
          boxShadow: isActive
            ? "0 0 16px 2px color-mix(in srgb, var(--primary) 70%, transparent)"
            : undefined,
        }}
        className={`absolute left-0 top-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-background transition-all duration-300 cursor-pointer z-10 ${
          isActive
            ? "border-primary scale-125"
            : "border-black/25 dark:border-textColor/30 hover:border-textColor hover:scale-110"
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            isActive ? "bg-primary animate-pulse" : "bg-black/30 dark:bg-textColor/40"
          }`}
        />
      </button>

      {/* Experience Content Card */}
      <div
        style={{
          boxShadow: isActive
            ? "0 0 24px -2px color-mix(in srgb, var(--primary) 18%, transparent)"
            : undefined,
        }}
        className={`rounded-2xl p-5 sm:p-6 bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md shadow-md transition-all duration-300 border ${
          isActive
            ? "border-primary/60"
            : "border-textColor/10 dark:border-white/5 hover:border-primary/40"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-textColor tracking-tight">
              {role}
            </h3>
            <p className="text-sm font-medium text-muted-textColor">
              {company}
            </p>
          </div>
          <span className="inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/10 font-mono text-xs text-textColor shrink-0">
            {period}
          </span>
        </div>

        {/* Tech Stack Pills */}
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-[11px] font-mono text-primary border border-black/[0.06] dark:border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Impact Bullets */}
        <ul className="space-y-2 text-xs sm:text-sm text-muted-textColor leading-relaxed list-disc list-outside ml-4">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="marker:text-textColor/40">
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
