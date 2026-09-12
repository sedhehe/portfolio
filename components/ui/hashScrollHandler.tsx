"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/lib/utils";

export default function HashScrollHandler() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        scrollToSection(hash);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
