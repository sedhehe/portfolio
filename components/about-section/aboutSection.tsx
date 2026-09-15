export default function AboutSection() {
  return (
    <section
      id="about"
      className="my-8 sm:my-10 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto"
      aria-label="About Me"
    >
      {/* Design language header matching skills, experience, and projects */}
      <div className="space-y-2 mb-6 sm:mb-10 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
          {"// 01. About Me"}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-textColor">
          Background &amp; Ethos
        </h2>
      </div>

      {/* Signature Glassmorphic Card Container following design language */}
      <div className="bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 transform-gpu p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left narrative column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-textColor leading-snug">
              Bridging Machine Intelligence &amp; High-Performance Web Systems
            </h3>

            <p className="text-sm sm:text-base text-textColor/90 leading-relaxed">
              I am a software engineer specializing in applied machine learning and full-stack engineering. I take models out of isolated notebooks and turn them into resilient, low-latency production software—spanning autonomous LLM agents, reinforcement learning simulations, and real-time fintech dashboards.
            </p>

            <p className="text-sm sm:text-base text-muted-textColor leading-relaxed">
              I believe great software combines backend structural rigor with front-of-the-glass craft—pairing asynchronous distributed queues with responsive, pixel-level polish.
            </p>
          </div>

          {/* Right focus cards */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-foreground/5 dark:bg-white/[0.03] border border-textColor/10 dark:border-white/5 hover:border-primary/40 transition-colors">
              <h4 className="font-semibold text-sm text-textColor flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Applied AI &amp; Agents
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-textColor leading-relaxed">
                Autonomous LLM tool chaining, neural network fraud detection, and reinforcement learning (DQN + YOLOv11).
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-foreground/5 dark:bg-white/[0.03] border border-textColor/10 dark:border-white/5 hover:border-primary/40 transition-colors">
              <h4 className="font-semibold text-sm text-textColor flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Real-Time &amp; Distributed Systems
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-textColor leading-relaxed">
                Sub-millisecond WebSocket communication, asynchronous task queues (Redis/Celery), and scalable FastAPI APIs.
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-foreground/5 dark:bg-white/[0.03] border border-textColor/10 dark:border-white/5 hover:border-primary/40 transition-colors">
              <h4 className="font-semibold text-sm text-textColor flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teritiary" />
                Modern Full-Stack Polish
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-textColor leading-relaxed">
                Next.js, React, and TypeScript applications engineered with strict design systems and fluid micro-interactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
