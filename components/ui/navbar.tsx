"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import AnimatedLogo from "@/components/ui/animatedLogo";
import { useState } from "react";
import GithubIcon from "@/public/assets/github-mark.svg";
import LinkedInIcon from "@/public/assets/LinkedIn_icon.svg";
import Mail from "@/public/assets/mail.svg";

const navItems = {
  labels: ["home", "about", "skills", "experience", "projects"],
  href: ["/", "#about", "#skills", "#experience", "#projects"],
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="p-6 flex w-full items-center justify-between relative"
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-start">
        <Link href="/">
          <AnimatedLogo />
        </Link>
      </div>

      <div className="hidden sm:flex gap-7">
        {navItems.labels.map((label, index) => (
          <motion.p
            key={label}
            animate={{ opacity: [0, 1], y: [-20, 0] }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={navItems.href[index]}
              className="hover:text-primary hover:scale-110 hover:font-bold ease-in-out duration-300 cursor-pointer"
            >
              {label}
            </Link>
          </motion.p>
        ))}
      </div>

      {/* Mobile hamburger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden flex flex-col gap-1.5 cursor-pointer"
        aria-label="Toggle menu"
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 10 : 0 }}
          className="w-6 h-0.5 bg-textColor block"
        />
        <motion.span
          animate={{ opacity: isOpen ? 0 : 1 }}
          className="w-6 h-0.5 bg-textColor block"
        />
        <motion.span
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -10 : 0 }}
          className="w-6 h-0.5 bg-textColor block"
        />
      </motion.button>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-background z-40 sm:hidden flex flex-col p-6"
          >

            <div className="flex justify-between items-center mb-8">
              <Link href="/">
                <AnimatedLogo />
              </Link>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="flex flex-col gap-1.5 cursor-pointer justify-center"
                aria-label="Close menu"
              >
                <motion.span
                  animate={{ rotate: 45, y: 8 }}
                  className="w-6 h-0.5 bg-textColor block origin-center"
                />
                <motion.span
                  animate={{ opacity: 0 }}
                  className="w-6 h-0.5 bg-textColor block"
                />
                <motion.span
                  animate={{ rotate: -45, y: -8 }}
                  className="w-6 h-0.5 bg-textColor block origin-center"
                />
              </motion.button>
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-6">
              {navItems.labels.map((label, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={navItems.href[index]}
                    className="text-textColor hover:text-primary transition-colors duration-200 text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-6 mt-auto">
              <Link
                href="https://github.com/sedhehe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon className="w-6 h-6 hover:text-primary transition-colors duration-200" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/vivek0310/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-6 h-6 hover:text-primary transition-colors duration-200" />
              </Link>
              <Link href="mailto:rvivek0310@gmail.com" aria-label="Email">
                <Mail className="w-6 h-6 hover:text-primary transition-colors duration-200" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
