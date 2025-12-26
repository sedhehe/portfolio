"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import AnimatedLogo from "../ui/animatedLogo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GithubIcon from "@/public/assets/github-mark.svg";
import LinkedInIcon from "@/public/assets/LinkedIn_icon.svg";
import Mail from "@/public/assets/mail.svg";

const navItems = {
  labels: ["home", "about", "skills", "experience", "projects"],
  href: ["#home", "#about", "#skills", "#experience", "#projects"],
};

const email = "rvivek0310@gmail.com";

export default function FooterSection() {
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTooltipOpen(true);
      setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy email", err);
    }
  };

  useEffect(() => {
    return () => {
      setTooltipOpen(false);
    };
  }, []);

  return (
    <motion.footer
      className="mt-16 border-t border-textColor/20 py-12 px-6 sm:px-10"
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-full grid gap-12 md:gap-16 grid-cols-1 md:grid-cols-4 md:items-start">
        <div className="flex flex-col items-center md:items-start gap-3">
          <AnimatedLogo />
        </div>

        <div className="flex flex-col items-center md:items-start gap-3">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Navigate
          </h3>
          <ul className="flex flex-col gap-2 items-center md:items-start">
            {navItems.labels.map((label) => (
              <li key={label}>
                <Link
                  href={navItems.href[navItems.labels.indexOf(label)]}
                  className="text-sm text-textColor hover:text-primary transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start gap-3">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Download
          </h3>
          <a
            href="/resume.pdf"
            download
            className="text-sm text-textColor hover:text-primary transition-colors duration-200"
          >
            My Resume
          </a>
        </div>

        <div className="flex flex-col items-center md:items-start gap-3">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Connect
          </h3>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/sedhehe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <GithubIcon className="w-5 h-5 hover:text-primary hover:scale-110 transition-all duration-300" />
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
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <LinkedInIcon className="w-5 h-5 hover:text-primary hover:scale-110 transition-all duration-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>vivek0310</p>
                </TooltipContent>
              </Tooltip>
            </Link>

            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-0 hover:text-primary hover:scale-110 transition-all duration-300"
                  aria-label="Copy email address"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied" : email}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* <div className="mt-12 pt-6 border-t border-textColor/10">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vivek. All rights reserved.
        </p>
      </div> */}
    </motion.footer>
  );
}
