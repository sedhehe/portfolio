import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Modern Async Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard.writeText failed, using fallback:", err);
    }
  }

  // Reliable Fallback for all environments/browsers
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

export function scrollToSection(hashOrId: string) {
  if (typeof window === "undefined") return;

  const id = hashOrId.replace(/^#/, "");
  if (!id || id === "home") {
    if (window.location.pathname !== "/") {
      window.location.href = "/";
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash !== "" && window.location.hash !== "#home") {
      window.history.pushState(null, "", "#home");
    }
    return;
  }

  const element = document.getElementById(id);
  if (!element) {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
    }
    return;
  }

  const rect = element.getBoundingClientRect();
  const elementHeight = rect.height;
  const viewportHeight = window.innerHeight;
  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

  let targetY: number;

  if (elementHeight + 32 <= viewportHeight) {
    // Section comfortably fits inside the viewport: vertically center it perfectly
    const verticalPadding = (viewportHeight - elementHeight) / 2;
    targetY = currentScrollY + rect.top - verticalPadding;
  } else if (elementHeight <= viewportHeight + 48) {
    // Section height is close to viewport height:
    // Align with minimal breathing room at top (~20px) so the bottom is completely in view
    targetY = currentScrollY + rect.top - 20;
  } else {
    // Section is taller than viewport (e.g. experience timeline or stacked mobile):
    // Align cleanly to the top with standard comfortable breathing room
    targetY = currentScrollY + rect.top - 24;
  }

  window.scrollTo({
    top: Math.max(0, Math.round(targetY)),
    behavior: "smooth",
  });

  window.history.pushState(null, "", `#${id}`);
}

export function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  scrollToSection(href);
}
