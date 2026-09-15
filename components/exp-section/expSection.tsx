"use client";

import { useState, useEffect } from "react";
import ExpCard from "@/components/exp-section/explist";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  isCurrent: boolean;
  stack: string[];
  bullets: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: "AI Solutions Engineer",
    company: "PiResearch Labs",
    period: "June 2025 – Present",
    isCurrent: true,
    stack: ["Next.js", "AWS", "TypeScript", "Python"],
    bullets: [
      "Built and maintained the production dashboard (app.payintelli.com) for an AI-driven payment orchestration platform, developing UI for real-time fraud risk scores, smart transaction routing, and automated payment insights.",
      "Developed the marketing site and product pages for 4 AI-powered fintech products (fraud detection, payment routing, reconciliation, conversational analytics) using Next.js and React.js.",
      "Worked cross-functionally with the AI/data team to accurately surface model-driven outputs (risk scores, routing decisions, predictive insights) in production-facing interfaces.",
    ],
  },
  {
    role: "Intern",
    company: "PXP",
    period: "February 2025 – May 2025",
    isCurrent: false,
    stack: ["React.js", "PyTorch"],
    bullets: [
      "Constructed a PyTorch-based fraud detection model trained on 10,000+ transaction records, achieving 94% classification accuracy and a 25% increase in recall while maintaining under 1% FPR.",
      "Exposed ML model predictions via a REST API integrated with a React.js dashboard, enabling real-time transaction risk visualization for end users.",
      "Delivered a production-ready ML pipeline covering data preprocessing, model training, evaluation, and frontend integration within a 3-month internship.",
    ],
  },
  {
    role: "Virtual Intern",
    company: "Google AIML | EduSkills AICTE COHORT-8",
    period: "April 2024 – June 2024",
    isCurrent: false,
    stack: ["TensorFlow", "OpenCV", "Google Colab Notebook"],
    bullets: [
      "Completed 3 end-to-end ML projects over 8 weeks, including a 5-class image classification CNN with >90% validation accuracy and a YOLOv5 object detection model served via Flask API.",
    ],
  },
  {
    role: "Member",
    company: "MLRIT CIE",
    period: "July 2022 – October 2023",
    isCurrent: false,
    stack: ["Web Technologies", "Figma", "Photoshop"],
    bullets: [
      "Shipped 3+ frontend features for the MLRIT CIE website using Wordpress, HTML, CSS, and JavaScript, improving navigation and event visibility for 500+ student users.",
      "Mentored 100+ students in project development and technical fundamentals.",
      "Coordinated technical events including Inventron and Metaloop.",
    ],
  },
  {
    role: "B.Tech in Computer Science & Engineering (AI & ML)",
    company: "MLR Institute of Technology, Hyderabad",
    period: "2021 – 2025",
    isCurrent: false,
    stack: ["Data Structures", "Algorithms", "Deep Learning", "Systems Design"],
    bullets: [
      "Graduated with a 7.81 CGPA, specializing in Artificial Intelligence, Machine Learning algorithms, Computer Vision, and Distributed Systems.",
    ],
  },
];

export default function ExpSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Dynamically highlight active bullet when card is in the center of the viewport
  useEffect(() => {
    let ticking = false;

    const updateActiveCard = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      experiences.forEach((_, idx) => {
        const el = document.getElementById(`exp-card-${idx}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveCard();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateActiveCard();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Smoothly center card in viewport on bullet click
  const handleBulletClick = (index: number) => {
    const el = document.getElementById(`exp-card-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveIndex(index);
    }
  };

  return (
    <section
      className="relative z-10 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      id="experience"
      aria-label="Professional Experience"
    >
      {/* Section Header */}
      <div className="space-y-2 mb-6 sm:mb-10 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
          {"// 03. Track Record"}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-textColor">
          Professional Experience &amp; Milestones
        </h2>
      </div>

      {/* Timeline Wrapper */}
      <div className="w-full">
        {experiences.map((exp, idx) => (
          <ExpCard
            key={`${exp.company}-${idx}`}
            index={idx}
            role={exp.role}
            company={exp.company}
            period={exp.period}
            isActive={activeIndex === idx}
            onBulletClick={() => handleBulletClick(idx)}
            stack={exp.stack}
            bullets={exp.bullets}
          />
        ))}
      </div>
    </section>
  );
}
