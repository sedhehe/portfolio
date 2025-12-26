"use client";

import { motion } from "motion/react";

import ProjectTile, {
  ProjectTileProps,
} from "@/components/projects-section/projectTile";

const projectsList: Record<string, ProjectTileProps> = {
  trafficManagement: {
    source: "/assets/bluImg1.png",
    title: "Smart Traffic Management System Using YOLOv11 and GBML DQN",
    desc: "Successfully optimised the traffic flow by using a Deep-Q-Network model in a traffic signal with computer vision using YOLOv11 for vehicle detection.",
    tech: ["python", "pytorch", "opencv"],
    link: "https://github.com/sedhehe/Smart_Traffic_Management_System_Using_YOLOv11_and_GBML_DQN",
  },
  xtree: {
    source: "/assets/bluImg2.png",
    title: "XTree",
    desc: "Developed a Chrome extension to scrape websites and save data directly into an Excel sheet. Streamlines data collection and organization workflows.",
    tech: ["html", "python", "javascript"],
    link: "https://github.com/sedhehe/XTree",
  },
  fraudnet: {
    source: "/assets/bluImg3.png",
    title: "PXP-FraudNet",
    desc: "A fraud detection custom neural network model to indentify frauds in the payments domain using python, integrated with a React.js frontend for visualization.",
    tech: ["react js", "python", "pytorch"],
    link: "/",
  },
};

export default function ProjectsSection() {
  return (
    <motion.section
      className="my-10 p-4"
      id="projects"
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 1 }}
    >
      <motion.h1 className="text-3xl font-bold text-center mb-10">
        projects
      </motion.h1>
      <div className="mx-auto md:max-w-7xl">
        {Object.entries(projectsList).map(([key, project]) => (
          <ProjectTile
            source={project.source}
            title={project.title}
            desc={project.desc}
            tech={project.tech}
            link={project.link}
            key={key}
          />
        ))}
      </div>
      {/* <div className="mt-6 flex justify-center">
          <motion.div
            initial="rest"
            animate="rest"
            whileHover="hover"
            className="group inline-flex flex-col items-center"
          >
            <Link href="#" className="text-textColor">
              show more
            </Link>
            <motion.span
              className="mt-1 h-0.5 w-full bg-textColor"
              style={{ transformOrigin: "left" }}
              variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.div>
        </div> */}
    </motion.section>
  );
}
