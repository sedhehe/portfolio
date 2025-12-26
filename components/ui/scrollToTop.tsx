"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");

    if (!navbar || !footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const navbarVisible = entries.some(
          (entry) => entry.target === navbar && entry.isIntersecting
        );
        const footerVisible = entries.some(
          (entry) => entry.target === footer && entry.isIntersecting
        );

        setIsVisible(!navbarVisible && !footerVisible);
      },
      { threshold: 0.1 }
    );

    observer.observe(navbar);
    observer.observe(footer);

    return () => {
      observer.unobserve(navbar);
      observer.unobserve(footer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: [0, 1], scale: [0, 1] }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={scrollToTop}
                className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                aria-label="Scroll to top"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Scroll to top</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
