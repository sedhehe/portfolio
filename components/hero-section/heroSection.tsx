"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MapPin from "@/public/assets/map-pin.svg";
import GithubIcon from "@/public/assets/github-mark.svg";
import LinkedInIcon from "@/public/assets/LinkedIn_icon.svg";
import Mail from "@/public/assets/mail.svg";
import Download from "@/public/assets/download.svg";

const text = "Vivek";

export default function HeroSection() {
  return (
    <motion.section
      className="p-7 my-2 mx-5 flex flex-col items-center text-center md:flex md:flex-row md:justify-center md:items-center md:gap-3 md:my-25 md:p-4"
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 1 }}
      id="home"
    >
      <motion.div
        className="relative w-48 h-48"
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Circle around Profile Image */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient
              id="circleGradient"
              x1="100%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="url(#circleGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.svg>
        <Image
          priority
          src="/profile.png"
          alt="Me"
          fill
          className="rounded-full object-cover p-2"
        />
      </motion.div>

      {/* Intro Text Section */}
      <div className="mt-4 md:mt-0 md:text-left">
        <div>
          <motion.h1 className="font-bold text-2xl">
            Hi, I am {/* Animated each letter of name */}
            {text.split("").map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                animate={{ opacity: [0, 1], y: [-20, 0] }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.span
            className="h-0.5 bg-primary block ml-33"
            animate={{ width: [0, "4.5rem"] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        <p className="flex mt-2 md:justify-start justify-center">
          <MapPin className="w-8 h-11" /> Hyderabad, India
        </p>
        <div className="flex mt-5.5 items-center justify-center md:justify-start">
          <Link
            href="https://github.com/sedhehe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub profile"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <GithubIcon className="w-7 h-7 hover:text-primary hover:scale-110 ease-in-out duration-300" />
              </TooltipTrigger>
              <TooltipContent>
                <p>sedhehe</p>
              </TooltipContent>
            </Tooltip>
          </Link>

          <Link
            href="https://www.linkedin.com/in/vivek0310/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LinkedIn profile"
            className="ml-4"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <LinkedInIcon className="w-7 h-7 hover:text-primary hover:scale-110 ease-in-out duration-300" />
              </TooltipTrigger>
              <TooltipContent>
                <p>vivek0310</p>
              </TooltipContent>
            </Tooltip>
          </Link>

          <Link
            href="mailto:rvivek0310@gmail.com"
            aria-label="Send email"
            className="ml-4"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Mail className="w-8 h-8 hover:text-primary hover:scale-110 ease-in-out duration-300" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Email Me</p>
              </TooltipContent>
            </Tooltip>
          </Link>

          <a
            href="/resume.pdf"
            download
            aria-label="Download resume"
            className="ml-4"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Download className="w-8 h-8 hover:text-primary hover:scale-110 ease-in-out duration-300" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Resume</p>
              </TooltipContent>
            </Tooltip>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
