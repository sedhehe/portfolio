import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

export function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const hash = href.replace('#', '');
  const element = document.getElementById(hash);
  if (element) {
    e.preventDefault();
    element.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', href);
  }
}
