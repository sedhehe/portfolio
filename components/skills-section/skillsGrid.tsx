"use client";

import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface SkillsGridProps {
  readonly icon: React.ReactNode;
  readonly name: string;
  readonly technology: string;
  readonly onClick?: () => void;
}

export default function SkillsGrid({
  icon,
  name,
  technology,
  onClick,
}: SkillsGridProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const gradientId = `skill-gradient-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateSize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
          setDimensions({
            width: entry.borderBoxSize[0].inlineSize,
            height: entry.borderBoxSize[0].blockSize,
          });
        } else {
          const rect = node.getBoundingClientRect();
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="group relative rounded-2xl p-3.5 sm:p-4 md:px-6 md:py-5 bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 flex items-center gap-3 sm:gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[68px] md:min-h-24 w-full"
    >
      {/* Dynamic Animated Gradient Outerline */}
      <motion.svg
        className="absolute inset-0 z-10 pointer-events-none overflow-visible"
        width={dimensions.width || "100%"}
        height={dimensions.height || "100%"}
        aria-hidden
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        {dimensions.width > 0 && dimensions.height > 0 && (
          <motion.rect
            x="1"
            y="1"
            width={Math.max(0, dimensions.width - 2)}
            height={Math.max(0, dimensions.height - 2)}
            rx="16"
            ry="16"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              rest: { pathLength: 0, opacity: 0 },
              hover: { pathLength: 1, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </motion.svg>

      <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center text-textColor transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-base text-textColor">{name}</h3>
        <p className="text-xs sm:text-sm text-muted-textColor">{technology}</p>
      </div>
    </motion.div>
  );
}
