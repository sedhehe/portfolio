"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  readonly className?: string;
}

export default function AnimatedLogo({ className }: AnimatedLogoProps) {
  return (
    <motion.svg
      width="32"
      height="29"
      viewBox="-1 -1 34 31"
      fill="none"
      className={cn(
        "scale-x-[-1] hover:scale-110 hover:text-primary duration-300 transition-all ease-in-out",
        className
      )}
    >
      {/* Stroke draw */}
      <motion.path
        d="M31.0742 0L17.8125 27.0117C17.6042 27.4284 17.2917 27.7604 16.875 28.0078C16.4714 28.2682 16.0221 28.3984 15.5273 28.3984C15.0456 28.3984 14.5964 28.2682 14.1797 28.0078C13.776 27.7604 13.4635 27.4284 13.2422 27.0117L0 0H5.68359L15.5273 20.1758L25.4102 0H31.0742Z"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      <motion.path
        d="M31.0742 0L17.8125 27.0117C17.6042 27.4284 17.2917 27.7604 16.875 28.0078C16.4714 28.2682 16.0221 28.3984 15.5273 28.3984C15.0456 28.3984 14.5964 28.2682 14.1797 28.0078C13.776 27.7604 13.4635 27.4284 13.2422 27.0117L0 0H5.68359L15.5273 20.1758L25.4102 0H31.0742Z"
        fill="currentColor"
        animate={{ opacity: [0, 1] }}
        transition={{ delay: 1.3, duration: 0.3 }}
      />
    </motion.svg>
  );
}
