"use client";

import { motion, AnimatePresence } from "motion/react";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/utils";
import MapPin from "@/public/assets/map-pin.svg";
import GithubIcon from "@/public/assets/github-mark.svg";
import LinkedInIcon from "@/public/assets/LinkedIn_icon.svg";
import Mail from "@/public/assets/mail.svg";
import Download from "@/public/assets/download.svg";
import Copy from "@/public/assets/copy.svg";
import Check from "@/public/assets/check.svg";

const text = "Vivek";
const email = "rvivek0310@gmail.com";

export default function HeroSection() {
  const [mailCopied, setMailCopied] = useState(false);
  const [mailTooltipOpen, setMailTooltipOpen] = useState(false);
  const [githubRedirecting, setGithubRedirecting] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);
  const [linkedinRedirecting, setLinkedinRedirecting] = useState(false);
  const [linkedinOpen, setLinkedinOpen] = useState(false);
  const [resumeDownloaded, setResumeDownloaded] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  // Synchronous refs to prevent Radix from dismissing tooltips on pointerdown/click/blur
  const isMailActionRef = useRef(false);
  const isGithubActionRef = useRef(false);
  const isLinkedinActionRef = useRef(false);
  const isDownloadActionRef = useRef(false);

  // Hover tracking refs to determine whether tooltip stays open or closes when timer ends
  const isMailHoveredRef = useRef(false);
  const isGithubHoveredRef = useRef(false);
  const isLinkedinHoveredRef = useRef(false);
  const isDownloadHoveredRef = useRef(false);

  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mailLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const githubTimerRef = useRef<NodeJS.Timeout | null>(null);
  const linkedinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const downloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetMailCopyState = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    if (mailLeaveTimerRef.current) {
      clearTimeout(mailLeaveTimerRef.current);
      mailLeaveTimerRef.current = null;
    }
    isMailActionRef.current = false;
    setMailCopied(false);
  };

  const handleMailOpenChange = (open: boolean) => {
    if (!open && isMailActionRef.current) {
      return;
    }
    setMailTooltipOpen(open);
  };

  const handleGithubOpenChange = (open: boolean) => {
    if (!open && isGithubActionRef.current) {
      return;
    }
    setGithubOpen(open);
  };

  const handleLinkedinOpenChange = (open: boolean) => {
    if (!open && isLinkedinActionRef.current) {
      return;
    }
    setLinkedinOpen(open);
  };

  const handleDownloadOpenChange = (open: boolean) => {
    if (!open && isDownloadActionRef.current) {
      return;
    }
    setDownloadOpen(open);
  };

  const handleMailCopy = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    isMailActionRef.current = true;
    if (mailLeaveTimerRef.current) {
      clearTimeout(mailLeaveTimerRef.current);
      mailLeaveTimerRef.current = null;
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    await copyToClipboard(email);
    setMailCopied(true);
    setMailTooltipOpen(true);

    // Automatically reset after 2.5 seconds
    resetTimerRef.current = setTimeout(() => {
      isMailActionRef.current = false;
      setMailCopied(false);
      resetTimerRef.current = null;
      if (!isMailHoveredRef.current) {
        setMailTooltipOpen(false);
      }
    }, 2500);
  };

  const handleMailMouseEnter = () => {
    isMailHoveredRef.current = true;
    if (mailLeaveTimerRef.current) {
      clearTimeout(mailLeaveTimerRef.current);
      mailLeaveTimerRef.current = null;
    }
    setMailTooltipOpen(true);
  };

  const handleMailMouseLeave = () => {
    isMailHoveredRef.current = false;
    if (mailLeaveTimerRef.current) {
      clearTimeout(mailLeaveTimerRef.current);
    }
    mailLeaveTimerRef.current = setTimeout(() => {
      if (!isMailHoveredRef.current && !isMailActionRef.current) {
        setMailTooltipOpen(false);
        if (mailCopied) {
          resetMailCopyState();
        }
      }
    }, 180);
  };

  const handleGithubClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isGithubActionRef.current = true;
    if (githubTimerRef.current) clearTimeout(githubTimerRef.current);
    setGithubRedirecting(true);
    setGithubOpen(true);

    // 550ms delay just like project cards
    setTimeout(() => {
      window.open("https://github.com/sedhehe", "_blank", "noopener,noreferrer");
    }, 550);

    githubTimerRef.current = setTimeout(() => {
      isGithubActionRef.current = false;
      setGithubRedirecting(false);
      githubTimerRef.current = null;
      if (!isGithubHoveredRef.current) {
        setGithubOpen(false);
      }
    }, 2500);
  };

  const handleGithubMouseEnter = () => {
    isGithubHoveredRef.current = true;
    if (githubRedirecting) {
      if (githubTimerRef.current) clearTimeout(githubTimerRef.current);
      isGithubActionRef.current = false;
      setGithubRedirecting(false);
    }
    setGithubOpen(true);
  };

  const handleGithubMouseLeave = () => {
    isGithubHoveredRef.current = false;
    if (!githubRedirecting && !isGithubActionRef.current) {
      setGithubOpen(false);
    }
  };

  const handleLinkedinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isLinkedinActionRef.current = true;
    if (linkedinTimerRef.current) clearTimeout(linkedinTimerRef.current);
    setLinkedinRedirecting(true);
    setLinkedinOpen(true);

    // 550ms delay just like project cards
    setTimeout(() => {
      window.open("https://www.linkedin.com/in/vivek0310/", "_blank", "noopener,noreferrer");
    }, 550);

    linkedinTimerRef.current = setTimeout(() => {
      isLinkedinActionRef.current = false;
      setLinkedinRedirecting(false);
      linkedinTimerRef.current = null;
      if (!isLinkedinHoveredRef.current) {
        setLinkedinOpen(false);
      }
    }, 2500);
  };

  const handleLinkedinMouseEnter = () => {
    isLinkedinHoveredRef.current = true;
    if (linkedinRedirecting) {
      if (linkedinTimerRef.current) clearTimeout(linkedinTimerRef.current);
      isLinkedinActionRef.current = false;
      setLinkedinRedirecting(false);
    }
    setLinkedinOpen(true);
  };

  const handleLinkedinMouseLeave = () => {
    isLinkedinHoveredRef.current = false;
    if (!linkedinRedirecting && !isLinkedinActionRef.current) {
      setLinkedinOpen(false);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isDownloadActionRef.current = true;
    if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
    setResumeDownloaded(true);
    setDownloadOpen(true);

    // 550ms delay just like project cards
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/assets/resume.pdf";
      link.download = "Vivek_Rallapally_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 550);

    downloadTimerRef.current = setTimeout(() => {
      isDownloadActionRef.current = false;
      setResumeDownloaded(false);
      downloadTimerRef.current = null;
      if (!isDownloadHoveredRef.current) {
        setDownloadOpen(false);
      }
    }, 2500);
  };

  const handleDownloadMouseEnter = () => {
    isDownloadHoveredRef.current = true;
    if (resumeDownloaded) {
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
      isDownloadActionRef.current = false;
      setResumeDownloaded(false);
    }
    setDownloadOpen(true);
  };

  const handleDownloadMouseLeave = () => {
    isDownloadHoveredRef.current = false;
    if (!resumeDownloaded && !isDownloadActionRef.current) {
      setDownloadOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Dismiss all open tooltips immediately on scroll
      setGithubOpen(false);
      setLinkedinOpen(false);
      setMailTooltipOpen(false);
      setDownloadOpen(false);

      isGithubHoveredRef.current = false;
      isLinkedinHoveredRef.current = false;
      isMailHoveredRef.current = false;
      isDownloadHoveredRef.current = false;

      isGithubActionRef.current = false;
      isLinkedinActionRef.current = false;
      isMailActionRef.current = false;
      isDownloadActionRef.current = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (mailLeaveTimerRef.current) clearTimeout(mailLeaveTimerRef.current);
      if (githubTimerRef.current) clearTimeout(githubTimerRef.current);
      if (linkedinTimerRef.current) clearTimeout(linkedinTimerRef.current);
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
    };
  }, []);

  return (
    <section
      className="p-4 sm:p-7 my-2 mx-auto flex flex-col items-center relative z-10 max-w-4xl"
      id="home"
    >
      {/* Profile and Details Row */}
      <div className="flex flex-col items-center text-center md:flex-row md:justify-center md:items-center md:gap-8 w-full my-6 sm:my-10">
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 shrink-0">
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
            src="/assets/profile.png"
            alt="Vivek Rallapally"
            fill
            className="rounded-full object-cover p-2"
            style={{ filter: "none" }}
          />
        </div>

        {/* Intro Text Section */}
        <div className="mt-4 md:mt-0 md:text-left">
          <div>
            <h1 className="sr-only">Vivek Rallapally — Software Engineer</h1>
            <motion.h2 className="font-bold text-2xl sm:text-3xl text-textColor inline-block">
              Hi, I am{" "}
              <span className="relative inline-block">
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
                {/* Underline precisely anchored to 'Vivek' */}
                <motion.span
                  className="h-0.5 bg-primary block w-full absolute -bottom-1 left-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: "left" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </span>
            </motion.h2>
          </div>

          {/* Location */}
          <p className="flex mt-3 md:justify-start justify-center items-center gap-1.5 text-sm text-muted-textColor">
            <MapPin className="w-5 h-5 text-textColor shrink-0 overflow-visible" aria-hidden="true" />
            <span>Hyderabad, India</span>
          </p>

          {/* Socials Row */}
          <div className="flex mt-5 items-center justify-center md:justify-start gap-2 sm:gap-4">
            <Tooltip open={githubOpen} onOpenChange={handleGithubOpenChange}>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/sedhehe"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub profile"
                  onClick={handleGithubClick}
                  onMouseEnter={handleGithubMouseEnter}
                  onMouseLeave={handleGithubMouseLeave}
                  onPointerDown={() => {
                    isGithubActionRef.current = true;
                  }}
                  className="cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-textColor/5"
                >
                  <motion.div whileTap={{ scale: 0.92 }}>
                    <GithubIcon className="w-7 h-7 hover:text-primary hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </a>
              </TooltipTrigger>
              <TooltipContent className="py-1.5 px-3 overflow-hidden select-none">
                <AnimatePresence mode="wait" initial={false}>
                  {githubRedirecting ? (
                    <motion.div
                      key="redirecting"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center gap-1.5 font-mono text-xs text-primary font-medium"
                    >
                      <motion.span
                        animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                        className="inline-block"
                      >
                        ↗
                      </motion.span>
                      <span>redirecting...</span>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="label"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="font-mono text-xs"
                    >
                      sedhehe
                    </motion.p>
                  )}
                </AnimatePresence>
              </TooltipContent>
            </Tooltip>

            <Tooltip open={linkedinOpen} onOpenChange={handleLinkedinOpenChange}>
              <TooltipTrigger asChild>
                <a
                  href="https://www.linkedin.com/in/vivek0310/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open LinkedIn profile"
                  onClick={handleLinkedinClick}
                  onMouseEnter={handleLinkedinMouseEnter}
                  onMouseLeave={handleLinkedinMouseLeave}
                  onPointerDown={() => {
                    isLinkedinActionRef.current = true;
                  }}
                  className="cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-textColor/5"
                >
                  <motion.div whileTap={{ scale: 0.92 }}>
                    <LinkedInIcon className="w-7 h-7 hover:text-primary hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </a>
              </TooltipTrigger>
              <TooltipContent className="py-1.5 px-3 overflow-hidden select-none">
                <AnimatePresence mode="wait" initial={false}>
                  {linkedinRedirecting ? (
                    <motion.div
                      key="redirecting"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center gap-1.5 font-mono text-xs text-primary font-medium"
                    >
                      <motion.span
                        animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                        className="inline-block"
                      >
                        ↗
                      </motion.span>
                      <span>redirecting...</span>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="label"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="font-mono text-xs"
                    >
                      vivek0310
                    </motion.p>
                  )}
                </AnimatePresence>
              </TooltipContent>
            </Tooltip>

            <Tooltip open={mailTooltipOpen} onOpenChange={handleMailOpenChange}>
              <TooltipTrigger asChild>
                <motion.button
                  type="button"
                  onClick={handleMailCopy}
                  onMouseEnter={handleMailMouseEnter}
                  onMouseLeave={handleMailMouseLeave}
                  onPointerDown={() => {
                    isMailActionRef.current = true;
                  }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Copy email address"
                  className="hover:text-primary hover:scale-110 transition-transform duration-300 cursor-pointer text-textColor min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-textColor/5"
                >
                  <Mail className="w-7 h-7 sm:w-8 sm:h-8" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                onMouseEnter={handleMailMouseEnter}
                onMouseLeave={handleMailMouseLeave}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  isMailActionRef.current = true;
                }}
                className="select-none py-1.5 px-3 overflow-hidden pointer-events-auto"
                title="Click to copy email"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mailCopied ? (
                    <motion.div
                      key="copied"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center gap-2 text-emerald-400 font-mono text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.span
                        initial={{ scale: 0.4, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="inline-flex items-center"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </motion.span>
                      <span className="font-semibold tracking-tight">Copied to clipboard!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center gap-2 font-mono text-xs"
                    >
                      <span
                        onClick={handleMailCopy}
                        className="hover:underline cursor-pointer"
                      >
                        {email}
                      </span>
                      <button
                        type="button"
                        onClick={handleMailCopy}
                        aria-label="Copy email to clipboard"
                        title="Copy email to clipboard"
                        className="p-1 -mr-1 rounded hover:bg-white/20 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Copy className="w-3.5 h-3.5 opacity-80 hover:opacity-100 transition-opacity" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TooltipContent>
            </Tooltip>

            <Tooltip open={downloadOpen} onOpenChange={handleDownloadOpenChange}>
              <TooltipTrigger asChild>
                <a
                  href="/assets/resume.pdf"
                  download="Vivek_Rallapally_Resume.pdf"
                  aria-label="Download resume"
                  onClick={handleDownloadClick}
                  onMouseEnter={handleDownloadMouseEnter}
                  onMouseLeave={handleDownloadMouseLeave}
                  onPointerDown={() => {
                    isDownloadActionRef.current = true;
                  }}
                  className="cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-textColor/5"
                >
                  <motion.div whileTap={{ scale: 0.92 }}>
                    <Download className="w-7 h-7 sm:w-8 sm:h-8 hover:text-primary hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </a>
              </TooltipTrigger>
              <TooltipContent className="py-1.5 px-3 overflow-hidden select-none">
                <AnimatePresence mode="wait" initial={false}>
                  {resumeDownloaded ? (
                    <motion.div
                      key="downloaded"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center gap-1.5 font-mono text-xs text-emerald-400 font-medium"
                    >
                      <motion.span
                        initial={{ scale: 0.4, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="inline-flex items-center"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </motion.span>
                      <span className="font-semibold tracking-tight">downloaded :)</span>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="label"
                      initial={{ opacity: 0, y: 3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="font-mono text-xs"
                    >
                      Download Resume
                    </motion.p>
                  )}
                </AnimatePresence>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Tagline Card (Part of Hero Section) */}
      <div className="mt-6 md:mt-8 w-full flex justify-center px-1">
        <h2 className="text-center font-bold text-lg sm:text-2xl md:text-3xl bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-textColor/10 dark:border-white/5 transform-gpu p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl max-w-3xl w-full sm:w-fit mx-auto shadow-xl text-textColor leading-relaxed sm:leading-normal">
          I am a{" "}
          <motion.span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--secondary) 0%, var(--primary) 50%, var(--secondary) 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Web Dev
          </motion.span>{" "}
          and an{" "}
          <motion.span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: 1.5,
            }}
          >
            AI/ML/DL
          </motion.span>{" "}
          Engineer
        </h2>
      </div>
    </section>
  );
}
