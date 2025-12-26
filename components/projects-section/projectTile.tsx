"use client";

import Image from "next/image";
import { motion, useMotionValue, animate } from "motion/react";

import FollowingBall, { size } from "../ui/followingBall";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

export interface ProjectTileProps {
  readonly source: string;
  readonly title: string;
  readonly desc: string;
  readonly tech: string[];
  readonly link: string;
}

export default function ProjectTile(props: ProjectTileProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(1);

  // Open link after a delay
  function openLinkWithDelay(url: string, delay = 1500) {
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, delay);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const targetX = e.clientX - rect.left - size / 2;
    const targetY = e.clientY - rect.top - size / 2;

    animate(x, targetX, {
      duration: 0.25,
      ease: "easeOut",
    });

    animate(y, targetY, {
      duration: 0.25,
      ease: "easeOut",
    });
  }

  function handleMouseEnter() {
    animate(opacity, 1, { duration: 0.3, ease: "easeOut" });
    animate(scale, 1, { duration: 0.3 });
  }

  function handleMouseLeave() {
    animate(opacity, 0, { duration: 0.3, ease: "easeInOut" });
  }

  function handleClick() {
    animate(scale, 2.5, { duration: 0.8, ease: "easeOut" });
    animate(opacity, 0, { duration: 0.8, ease: "easeOut" });
    openLinkWithDelay(props.link, 500);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <motion.div
      role="link"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative overflow-hidden h-auto w-full bg-foreground/10 backdrop-blur-2xl rounded-2xl flex flex-col md:flex-row cursor-pointer mt-4"
    >
      <FollowingBall x={x} y={y} opacity={opacity} scale={scale} />

      {/* image div */}
      <div className="relative w-full md:w-1/4 h-48 md:h-auto shrink-0">
        <Image
          src={props.source}
          alt="project image"
          fill
          className="object-cover rounded-t-2xl md:rounded-t-none md:rounded-l-2xl"
        />
      </div>

      {/* content div */}
      <div className="ml-0 md:ml-5 p-4 md:p-0 flex flex-col flex-1">
        <h2 className="text-lg md:text-xl font-bold mt-4 md:mt-4">
          {props.title}
        </h2>
        <p className="text-sm md:text-md mt-3 md:mt-5 mb-4 md:mb-15 text-muted-textColor max-w-9/12">
          {props.desc}
        </p>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 my-4 mt-auto">
          <div className="flex gap-2 flex-wrap">
            {props.tech.map((techItem, index) => (
              <span
                key={index}
                className={cn(
                  "text-xs md:text-sm text-background font-bold px-3 py-1 md:px-4 md:py-2 rounded-md",
                  index % 2 === 1 ? "bg-teritiary" : "bg-primary"
                )}
              >
                {techItem}
              </span>
            ))}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="bg-none hover:bg-textColor border border-textColor text-textColor hover:text-background duration-300 transition-colors ease-in-out cursor-pointer text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full md:mr-10 whitespace-nowrap"
              >
                View Project
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-textColor text-background">
              <p>
                Click anywhere on the tile or the button to view the details
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}
