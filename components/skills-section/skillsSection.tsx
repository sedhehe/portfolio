"use client";

import SkillsGrid, {
  SkillsGridProps,
} from "@/components/skills-section/skillsGrid";

import { scrollToSection } from "@/lib/utils";

import ReactIcon from "@/public/assets/react.svg";
import NextjsIcon from "@/public/assets/nextjs.svg";
import TypeScriptIcon from "@/public/assets/typescript.svg";
import JavaScriptIcon from "@/public/assets/javascript.svg";
import PythonIcon from "@/public/assets/python.svg";
import PytorchIcon from "@/public/assets/pytorch.svg";
import AwsIcon from "@/public/assets/aws.svg";
import GitIcon from "@/public/assets/git.svg";

const skillsData: Record<string, SkillsGridProps> = {
  pytorch: {
    icon: <PytorchIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "PyTorch",
    technology: "Deep Learning & RL",
  },
  nextjs: {
    icon: <NextjsIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "Next.js",
    technology: "Full-Stack & SSR",
  },
  typescript: {
    icon: <TypeScriptIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "TypeScript",
    technology: "Type Systems & Architecture",
  },
  python: {
    icon: <PythonIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "Python",
    technology: "Async APIs & ML Pipelines",
  },
  react: {
    icon: <ReactIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "React.js",
    technology: "Interactive Dashboards",
  },
  aws: {
    icon: <AwsIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "AWS",
    technology: "Cloud & Microservices",
  },
  javascript: {
    icon: <JavaScriptIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "JavaScript",
    technology: "Web Technologies & Tooling",
  },
  git: {
    icon: <GitIcon className="w-8 h-8 md:w-10 md:h-10" />,
    name: "Git",
    technology: "Version Control & CI/CD",
  },
};

export default function SkillsSection() {
  const handleSkillClick = (skillKey: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("skill-clicked-to-projects", {
          detail: { skill: skillKey },
        })
      );
    }
    scrollToSection("#projects");
  };

  return (
    <section
      className="my-8 sm:my-10 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto"
      id="skills"
    >
      {/* Design language header matching other sections */}
      <div className="space-y-2 mb-6 sm:mb-10 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
          {"// 02. Technical Competencies"}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-textColor">
          Skills &amp; Technologies
        </h2>
      </div>

      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 transform-gpu p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl">
        {Object.entries(skillsData).map(([key, skill]) => (
          <SkillsGrid
            key={key}
            icon={skill.icon}
            name={skill.name}
            technology={skill.technology}
            onClick={() => handleSkillClick(key)}
          />
        ))}
      </div>
    </section>
  );
}
