"use client";

import { motion, MotionValue } from "motion/react";

interface FollowingBallProps {
  readonly x: MotionValue<number>;
  readonly y: MotionValue<number>;
  readonly opacity: MotionValue<number>;
  readonly scale: MotionValue<number>;
}

const size = 256; // matches w-64 h-64

export default function FollowingBall({
  x,
  y,
  opacity,
  scale,
}: FollowingBallProps) {
  return (  
    <motion.div
      className="pointer-events-none absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -z-10 bg-seconwdary/30 dark:bg-primary/30"
      style={{
        opacity,
        scale,
        translateX: x,
        translateY: y,
        background:
          "radial-gradient(circle at center, var(--primary), transparent 70%)",
      }}
    />
  );
}

export { size };
