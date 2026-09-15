"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "motion/react";
import FollowingBall, { size } from "@/components/ui/followingBall";
import GithubIcon from "@/public/assets/github-mark.svg";

export interface ProjectTileProps {
  readonly source: string;
  readonly category: string;
  readonly title: string;
  readonly desc: string;
  readonly tech: string[];
  readonly link: string;
  readonly isInternal?: boolean;
  readonly isSkillHighlighted?: boolean;
  readonly isHoverDelayed?: boolean;
  readonly activeSkill?: string;
}

export default function ProjectTile(props: ProjectTileProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(1);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const targetX = e.clientX - rect.left - size / 2;
    const targetY = e.clientY - rect.top - size / 2;

    animate(x, targetX, { duration: 0.25, ease: "easeOut" });
    animate(y, targetY, { duration: 0.25, ease: "easeOut" });
  }

  function handleMouseEnter() {
    if (props.isHoverDelayed && !props.isSkillHighlighted) {
      // Delay hover effect on other cards when navigated via skill
      hoverTimeoutRef.current = setTimeout(() => {
        animate(opacity, 1, { duration: 0.3, ease: "easeOut" });
        animate(scale, 1, { duration: 0.3 });
      }, 600);
      return;
    }

    animate(opacity, 1, { duration: 0.3, ease: "easeOut" });
    animate(scale, 1, { duration: 0.3 });
  }

  function handleMouseLeave() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    animate(opacity, 0, { duration: 0.3, ease: "easeInOut" });
  }

  function handleClick() {
    if (props.link && !props.isInternal && props.link !== "#") {
      // Explode the glowing following ball outward across the card
      animate(scale, 3, { duration: 0.7, ease: "easeOut" });
      animate(opacity, [1, 0.8, 0], { duration: 0.7, ease: "easeOut" });

      // Delay opening the link so the user can enjoy the explode animation
      setTimeout(() => {
        window.open(props.link, "_blank", "noopener,noreferrer");
        setTimeout(() => {
          scale.set(1);
          opacity.set(0);
        }, 200);
      }, 550);
    }
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
      animate={{
        scale: props.isSkillHighlighted ? 1.018 : 1,
      }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        boxShadow: props.isSkillHighlighted
          ? "0 0 32px -4px var(--primary), inset 0 0 16px -4px var(--primary)"
          : "0 0 0px 0px transparent, inset 0 0 0px 0px transparent",
        transition:
          "box-shadow 0.75s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.75s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.75s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={`relative overflow-hidden h-auto w-full backdrop-blur-md transform-gpu rounded-2xl flex flex-col md:flex-row cursor-pointer shadow-xl ${
        props.isSkillHighlighted
          ? "bg-primary/[0.08] border border-primary z-20"
          : "bg-foreground/5 border border-textColor/10 dark:border-white/5"
      } ${
        props.isHoverDelayed && !props.isSkillHighlighted
          ? "group hover:border-primary/40 hover:transition-all hover:duration-500 hover:delay-500"
          : "group hover:border-primary/40"
      }`}
    >
      <FollowingBall x={x} y={y} opacity={opacity} scale={scale} />

      {/* image div: wide and narrow to showcase seamless gradient */}
      <div className="relative z-10 w-full md:w-[32%] lg:w-[30%] h-48 sm:h-52 md:h-auto min-h-[180px] sm:min-h-[200px] md:min-h-[210px] shrink-0 overflow-hidden">
        <Image
          src={props.source}
          alt={props.title}
          fill
          className={`object-cover rounded-t-2xl md:rounded-t-none md:rounded-l-2xl transition-all duration-500 ease-out ${
            props.isSkillHighlighted
              ? "brightness-110 contrast-105 saturate-120"
              : "group-hover:brightness-110 group-hover:contrast-105 group-hover:saturate-120"
          }`}
          style={{ filter: "var(--image-filter, none)" }}
        />
        {/* Luminous sheen overlay on card hover or skill highlight without any zoom */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-white/10 pointer-events-none rounded-t-2xl md:rounded-t-none md:rounded-l-2xl transition-opacity duration-500 ${
            props.isSkillHighlighted
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        />
      </div>

      {/* content div */}
      <div className="relative z-10 ml-0 md:ml-6 p-4 sm:p-5 md:py-6 md:px-7 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-textColor tracking-tight mt-0.5 mb-2">
            {props.title}
          </h3>
          <p className="text-sm md:text-[14.5px] text-muted-textColor max-w-3xl leading-relaxed mt-1 mb-4 md:mb-5">
            {props.desc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-auto pt-1">
          {/* Tech Badges */}
          <div className="flex gap-2 flex-wrap">
            {props.tech.map((techItem, index) => {
              const isBadgeActive =
                props.isSkillHighlighted &&
                props.activeSkill &&
                (techItem.toLowerCase().includes(props.activeSkill.toLowerCase()) ||
                  props.activeSkill.toLowerCase().includes(techItem.toLowerCase()));

              return (
                <span
                  key={index}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-300 ${
                    isBadgeActive
                      ? "bg-primary/20 border border-primary text-primary font-semibold shadow-[0_0_12px_var(--primary)] scale-105"
                      : "bg-textColor/[0.05] border border-textColor/10 text-textColor"
                  }`}
                >
                  {techItem}
                </span>
              );
            })}
          </div>

          {/* Action button with Github icon, or Proprietary Architecture when internal */}
          <div className="shrink-0 flex items-center md:mr-2">
            {!props.isInternal && props.link ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="inline-flex items-center gap-2 min-h-[36px] px-3.5 rounded-full bg-textColor/[0.06] hover:bg-textColor/[0.15] text-textColor border border-textColor/20 hover:border-primary text-xs font-semibold font-mono transition-all cursor-pointer"
                aria-label={`View code for ${props.title}`}
              >
                <GithubIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View Project</span>
              </button>
            ) : (
              <span className="text-xs font-mono text-muted-textColor italic">
                Proprietary Architecture
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
