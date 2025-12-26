"use client";

import { motion } from "motion/react";

export interface SkillsGridProps {
  readonly icon: React.ReactNode;
  readonly name: string;
  readonly technology: string;
}

export default function SkillsGrid({
  icon,
  name,
  technology,
}: SkillsGridProps) {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      tabIndex={0}
      className="group relative rounded-2xl"
    >
      {/* Animated ring */}
      <motion.svg className="absolute inset-0 z-1 h-full w-full" aria-hidden>
        <defs>
          <linearGradient
            id={`skill-gradient`}
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        <motion.rect
          x="1.4"
          y="1.4"
          width="98.7%"
          height="97.4%"
          rx="15"
          ry="15" /* match rounded-2xl + the outward inset */
          fill="none"
          stroke={`url(#skill-gradient)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          variants={{
            rest: { pathLength: 0, opacity: 0 },
            hover: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </motion.svg>

      <div className="relative z-0 rounded-2xl p-2 min-w-48 md:px-6 md:py-5 bg-textColor/10 md:bg-transparent flex items-center gap-4 transition-colors duration-1000 group-hover:bg-textColor/10 hover:backdrop-blur-sm md:min-h-28">
        {icon}
        <div>
          <h2 className="font-semibold text-base">{name}</h2>
          <p className="text-sm text-muted-textColor">{technology}</p>
        </div>
      </div>
    </motion.div>
  );
}
