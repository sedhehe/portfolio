"use client";

import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      className="my-10 p-4 relative z-10 max-w-6xl mx-auto"
      aria-label="About Me"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {/* Design language header matching skills, experience, and projects */}
      <div className="space-y-2 mb-10 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
          {"// 01. About Me"}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-textColor">
          Background &amp; Ethos
        </h2>
      </div>

      {/* Signature Glassmorphic Card Container following design language */}
      <div className="bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 transform-gpu p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left narrative column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-textColor">
              Engineering Intelligent Systems from Models to Pixels
            </h3>

            <p className="text-sm sm:text-base text-textColor/90 leading-relaxed">
              I build software where complex machine intelligence meets refined, responsive interfaces. Rather than treating artificial intelligence and modern web engineering as separate silos, I work across the full spectrum—taking models out of isolated notebooks and turning them into resilient, high-speed production software.
            </p>

            <p className="text-sm sm:text-base text-muted-textColor leading-relaxed">
              My work centers on agency, real-time telemetry, and low-latency interaction. Whether I’m training deep reinforcement learning models to optimize complex simulation flows, orchestrating local LLM agents capable of autonomous OS-level tool execution, or constructing high-density fintech dashboards, I focus on building systems that feel immediate, reliable, and deeply engineered.
            </p>

            <p className="text-sm sm:text-base text-muted-textColor leading-relaxed">
              I believe great engineering requires equal parts structural rigor and aesthetic craft. From asynchronous queue architectures and WebSocket streams to typography rhythm and GPU-accelerated micro-animations, every layer is built with intentionality.
            </p>
          </div>

          {/* Right focus cards */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="rounded-2xl p-5 bg-foreground/5 dark:bg-white/[0.03] border border-textColor/10 dark:border-white/5 hover:border-primary/40 transition-colors">
              <h4 className="font-semibold text-sm text-textColor flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Autonomous Agents &amp; Applied AI
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-muted-textColor leading-relaxed">
                Local LLM agent workflows with tool chaining and OS automation, custom neural networks for fraud detection, and reinforcement learning (DQN) integrated with computer vision pipelines.
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-foreground/5 dark:bg-white/[0.03] border border-textColor/10 dark:border-white/5 hover:border-primary/40 transition-colors">
              <h4 className="font-semibold text-sm text-textColor flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Real-Time &amp; Distributed Architecture
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-muted-textColor leading-relaxed">
                Sub-millisecond WebSocket communication, asynchronous task processing with Redis and Celery, and scalable Python and FastAPI microservices.
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-foreground/5 dark:bg-white/[0.03] border border-textColor/10 dark:border-white/5 hover:border-primary/40 transition-colors">
              <h4 className="font-semibold text-sm text-textColor flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teritiary" />
                Modern Full-Stack &amp; Product Polish
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-muted-textColor leading-relaxed">
                Next.js, React, and TypeScript applications engineered with strict design systems, fluid motion physics, and accessible, production-ready performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
