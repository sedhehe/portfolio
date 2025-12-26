"use client";

import { motion } from "motion/react";

import SkillsGrid, {
  SkillsGridProps,
} from "@/components/skills-section/skillsGrid";

import React from "@/public/assets/react.svg";
import Nextjs from "@/public/assets/nextjs.svg";
import TypeScript from "@/public/assets/typescript.svg";
import JavaScript from "@/public/assets/javascript.svg";
import Python from "@/public/assets/python.svg";
import Pytorch from "@/public/assets/pytorch.svg";
import Aws from "@/public/assets/aws.svg";
import Git from "@/public/assets/git.svg";

const skillsData: Record<string, SkillsGridProps> = {
  react: {
    icon: <React className="w-8 h-8 md:w-12 md:h-12" />,
    name: "React.js",
    technology: "Front-end",
  },
  nextjs: {
    icon: <Nextjs className="w-8 h-8 md:w-12 md:h-12" />,
    name: "Next.js",
    technology: "Full-stack",
  },
  typescript: {
    icon: <TypeScript className="w-8 h-8 md:w-12 md:h-12" />,
    name: "TypeScript",
    technology: "Programming Language",
  },
  javascript: {
    icon: <JavaScript className="w-8 h-8 md:w-12 md:h-12" />,
    name: "JavaScript",
    technology: "Programming Language",
  },
  python: {
    icon: <Python className="w-8 h-8 md:w-12 md:h-12" />,
    name: "Python",
    technology: "Programming Language",
  },
  pytorch: {
    icon: <Pytorch className="w-8 h-8 md:w-12 md:h-12" />,
    name: "Pytorch",
    technology: "AI/ML/DL Framework",
  },
  aws: {
    icon: <Aws className="w-8 h-8 md:w-12 md:h-12" />,
    name: "AWS",
    technology: "Cloud Platform",
  },
  git: {
    icon: <Git className="w-8 h-8 md:w-12 md:h-12" />,
    name: "Git",
    technology: "Version Control",
  },
};

export default function SkillsSection() {
  return (
    <motion.section
      className="my-10 p-4"
      id="skills"
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 1 }}
    >
      <motion.h1 className="text-3xl font-bold text-center mb-10">
        skills
      </motion.h1>
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-6 md:max-w-5xl">
        {Object.entries(skillsData).map(([key, skill]) => (
          <SkillsGrid
            key={key}
            icon={skill.icon}
            name={skill.name}
            technology={skill.technology}
          />
        ))}
      </div>
    </motion.section>
  );
}
