"use client";

import { motion } from "motion/react";

export default function AboutSection() {
  return (
      <motion.section
        className="my-10 p-4"
        id="about"
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 1 }}
      >
        <motion.h2 className="text-center font-bold text-3xl">
          I am a{" "}
          <motion.span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #036799 0%, #05acff 50%, #036799 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Web Dev
          </motion.span>{" "}
          and an{" "}
          <motion.span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #05acff 0%, #036799 50%, #05acff 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
          >
            AI/ML/DL
          </motion.span>{" "}
          Engineer
        </motion.h2>
      </motion.section>
  );
}
