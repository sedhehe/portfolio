"use client";

import { motion } from "motion/react";

export interface ExpListProps {
  readonly role: string;
  readonly project: React.ReactNode;
  readonly from: string;
  readonly to: string;
}

const ball = {
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "var(--textColor)",
};

export default function ExpList(props: ExpListProps) {
  return (
    <motion.div
      className="relative mb-8"
      whileInView={{ opacity: [0, 1] }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <div className="flex gap-6">
        <div style={ball} className="shrink-0 mt-5" />

        <div className="flex-1 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
              <h2 className="text-xl font-semibold">{props.role}</h2>
              <div className="text-base mt-1">{props.project}</div>
            </div>
            <p className="text-sm text-muted-textColor whitespace-nowrap">
              {props.from} - {props.to}
            </p>
          </div>

          <motion.span
            className="absolute h-0.5 bg-linear-to-r from-primary to-transparent"
            style={{
              left: 0,
              right: 0,
              bottom: 0,
              transformOrigin: "left",
            }}
            whileInView={{ scaleX: [0, 1] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
