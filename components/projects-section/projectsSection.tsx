"use client";

import { useState, useEffect, useRef } from "react";
import ProjectTile, {
  ProjectTileProps,
} from "@/components/projects-section/projectTile";

const projectsList: Record<string, ProjectTileProps> = {
  trafficManagement: {
    source: "/assets/bluImg1.png",
    category: "COMPUTER VISION & REINFORCEMENT LEARNING",
    title: "Smart Traffic Management System Using YOLOv11 and GBML DQN",
    desc: "Successfully optimised the traffic flow by using a Deep-Q-Network model in a traffic signal with computer vision using YOLOv11 for vehicle detection.",
    tech: ["python", "pytorch", "opencv"],
    link: "https://github.com/sedhehe/Smart_Traffic_Management_System_Using_YOLOv11_and_GBML_DQN",
    isInternal: false,
  },
  xtree: {
    source: "/assets/bluImg2.png",
    category: "DEVELOPER TOOLING & AUTOMATION",
    title: "XTree",
    desc: "Developed a Chrome extension to scrape websites and save data directly into an Excel sheet. Streamlines data collection and organization workflows.",
    tech: ["html", "python", "javascript"],
    link: "https://github.com/sedhehe/XTree",
    isInternal: false,
  },
  fraudnet: {
    source: "/assets/bluImg3.png",
    category: "FINTECH & FRAUD DETECTION",
    title: "PXP-FraudNet",
    desc: "A fraud detection custom neural network model to identify frauds in the payments domain using python, integrated with a React.js frontend for visualization.",
    tech: ["react js", "python", "pytorch"],
    link: "",
    isInternal: true,
  },
};

const SKILL_PROJECT_MAP: Record<string, string[]> = {
  pytorch: ["trafficManagement", "fraudnet"],
  nextjs: ["fraudnet"],
  typescript: ["fraudnet"],
  python: ["trafficManagement", "xtree", "fraudnet"],
  react: ["fraudnet"],
  aws: ["trafficManagement", "fraudnet"],
  javascript: ["xtree"],
  git: ["trafficManagement", "xtree", "fraudnet"],
};

function getMatchingProjects(skillKey: string): string[] {
  const normalizedKey = skillKey.toLowerCase().replace(/[^a-z0-9]/g, "");
  const manual = SKILL_PROJECT_MAP[skillKey] || [];

  const dynamic = Object.entries(projectsList)
    .filter(([, proj]) =>
      proj.tech.some((t) => {
        const normT = t.toLowerCase().replace(/[^a-z0-9]/g, "");
        return normT.includes(normalizedKey) || normalizedKey.includes(normT);
      })
    )
    .map(([k]) => k);

  const combined = Array.from(new Set([...manual, ...dynamic]));
  return combined.length > 0 ? combined : Object.keys(projectsList);
}

export default function ProjectsSection() {
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [activeSkill, setActiveSkill] = useState<string>("");
  const [isHoverDelayed, setIsHoverDelayed] = useState<boolean>(false);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  useEffect(() => {
    const handleSkillClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ skill: string }>;
      const skill = customEvent.detail?.skill;
      if (!skill) return;

      clearAllTimers();

      const matchedProjects = getMatchingProjects(skill);

      // Immediately engage hover delay so cards under the cursor during scroll don't trigger instant hover
      setIsHoverDelayed(true);
      setActiveSkill(skill);

      // Smooth scroll takes ~520-580ms; trigger highlight right as user lands in the projects section
      const arrivalTimer = setTimeout(() => {
        setHighlightedKeys(matchedProjects);

        // Highlight with scale up and background glow for 1.25 seconds (1250ms)
        const highlightTimer = setTimeout(() => {
          setHighlightedKeys([]);

          // Allow a smooth cooldown (~600ms) after highlight eases back before restoring instant hover
          const resetDelayTimer = setTimeout(() => {
            setIsHoverDelayed(false);
            setActiveSkill("");
          }, 600);

          timerRefs.current.push(resetDelayTimer);
        }, 1250);

        timerRefs.current.push(highlightTimer);
      }, 580);

      timerRefs.current.push(arrivalTimer);
    };

    window.addEventListener("skill-clicked-to-projects", handleSkillClick);

    return () => {
      window.removeEventListener("skill-clicked-to-projects", handleSkillClick);
      clearAllTimers();
    };
  }, []);

  return (
    <section
      className="my-8 sm:my-10 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto"
      id="projects"
    >
      {/* Section Header */}
      <div className="space-y-2 mb-6 sm:mb-10 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
          {"// 04. Selected Works"}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-textColor">
          Projects
        </h2>
      </div>

      <div className="mx-auto w-full flex flex-col gap-4">
        {Object.entries(projectsList).map(([key, project]) => (
          <ProjectTile
            key={key}
            source={project.source}
            category={project.category}
            title={project.title}
            desc={project.desc}
            tech={project.tech}
            link={project.link}
            isInternal={project.isInternal}
            isSkillHighlighted={highlightedKeys.includes(key)}
            isHoverDelayed={isHoverDelayed}
            activeSkill={activeSkill}
          />
        ))}
      </div>
    </section>
  );
}
