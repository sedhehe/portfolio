"use client";

import { motion } from "motion/react";

import ExpList, { ExpListProps } from "@/components/exp-section/explist";

const expList: Record<string, ExpListProps> = {
  internship: {
    role: "Intern at PXP",
    project: (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="text-primary">React.js</span>,{" "}
          <span className="text-primary">PyTorch</span>
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            Developed a fraud detection machine learning model using PyTorch to
            identify suspicious transactions
          </li>
          <li>
            Designed and integrated a React.js-based user interface to visualize
            model outputs and predictions
          </li>
          <li>
            Collaborated on bridging the ML backend with the frontend, enabling
            seamless interaction between the model and the web application
          </li>
          <li>
            Improved understanding of end-to-end ML deployment workflows and
            frontend-backend integration
          </li>
        </ul>
      </div>
    ),
    from: "Feb 2025",
    to: "May 2025",
  },
  googleIntern: {
    role: "Virtual Intern for Google AIML | EduSkills AICTE COHORT-8",
    project: (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="text-primary">TensorFlow</span>,{" "}
          <span className="text-primary">OpenCV</span>,{" "}
          <span className="text-primary">Colab Notebook</span>
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            Learnt how to build Machine Learning models and Neural Networks
          </li>
          <li>Developed an Image Processing Model</li>
          <li>Built an Object Detection model and integrated into an app</li>
        </ul>
      </div>
    ),
    from: "Apr 2024",
    to: "Jun 2024",
  },
  cieMember: {
    role: "Member | MLRIT CIE",
    project: (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="text-primary">Web Technologies</span>,{" "}
          <span className="text-primary">Figma</span>,{" "}
          <span className="text-primary">Photoshop</span>
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            Designed and developed features for the CIE website, improving user
            experience and functionality as a Technical Member
          </li>
          <li>
            Mentored and coached over 100 students, guiding them through project
            development and enhancing their technical skills
          </li>
          <li>
            Organized and coordinated events such as Inventron and Metaloop,
            ensuring smooth execution and high participation
          </li>
          <li>Photographed and documented various events conducted</li>
        </ul>
      </div>
    ),
    from: "Jul 2022",
    to: "Oct 2023",
  },
  college: {
    role: "B.Tech in CSE-AI/ML at MLRIT Hyderabad",
    project: <p>CGPA: 7.9</p>,
    from: "2021",
    to: "2025",
  },
};

export default function ExpSection() {
  return (
      <motion.section
        className="my-10 p-4"
        id="experience"
        whileInView={{ opacity: [0, 1] }}
        transition={{ duration: 1 }}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-10">
          experience
        </motion.h2>
        <div className="mx-auto md:max-w-7xl">
          {Object.entries(expList).map(([key, exp]) => (
            <ExpList
              role={exp.role}
              project={exp.project}
              from={exp.from}
              to={exp.to}
              key={key}
            />
          ))}
        </div>
      </motion.section>
  );
}
