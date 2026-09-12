import type { Metadata } from "next";
import { Source_Code_Pro } from "next/font/google";
import Navbar from "@/components/ui/navbar";
import ScrollToTop from "@/components/ui/scrollToTop";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AsciiBackground } from "@/components/ascii-background/AsciiBackground";
import HashScrollHandler from "@/components/ui/hashScrollHandler";
import "./globals.css";

const sourceCodeProSans = Source_Code_Pro({
  variable: "--font-source-code-pro-sans",
  subsets: ["latin"],
});

const sourceCodeProMono = Source_Code_Pro({
  variable: "--font-source-code-pro-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sedhehe.vercel.app"),
  title: "Vivek's Portfolio",
  description:
    "Portfolio of Vivek Rallapally (sedhehe) — Software engineer crafting intelligent systems, applied machine learning models, and high-performance web applications.",
  keywords: [
    "Vivek Rallapally",
    "sedhehe",
    "Software Engineer",
    "Full-Stack Developer",
    "AI Engineer",
    "Machine Learning Engineer",
    "PyTorch",
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "WebSockets",
    "Reinforcement Learning",
    "Deep Learning",
    "Autonomous Agents",
    "YOLOv11",
  ],
  authors: [{ name: "Vivek Rallapally", url: "https://sedhehe.vercel.app" }],
  creator: "Vivek Rallapally",
  publisher: "Vivek Rallapally",
  alternates: {
    canonical: "https://sedhehe.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "sedhehe's portfolio",
    description:
      "Portfolio of Vivek Rallapally (sedhehe) — Software engineer crafting intelligent systems, applied machine learning models, and high-performance web applications.",
    url: "https://sedhehe.vercel.app",
    siteName: "sedhehe's portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/preview-img.png",
        width: 1200,
        height: 1200,
        alt: "sedhehe's portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "sedhehe's portfolio",
    description:
      "Portfolio of Vivek Rallapally (sedhehe) — Software engineer crafting intelligent systems, applied machine learning models, and high-performance web applications.",
    images: ["/assets/preview-img.png"],
    creator: "@sedhehe",
  },
  icons: {
    icon: [
      {
        rel: "icon",
        url: "/assets/favicon-light.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        url: "/assets/favicon-dark.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sedhehe.vercel.app/#person",
      "name": "Vivek Rallapally",
      "alternateName": ["sedhehe", "Vivek"],
      "url": "https://sedhehe.vercel.app",
      "image": "https://sedhehe.vercel.app/assets/profile.png",
      "sameAs": [
        "https://github.com/sedhehe",
        "https://www.linkedin.com/in/vivek0310"
      ],
      "jobTitle": "Software Engineer",
      "description":
        "Software engineer crafting intelligent systems, applied machine learning models, and high-performance web applications.",
      "knowsAbout": [
        "Software Engineering",
        "Artificial Intelligence",
        "Deep Learning",
        "Reinforcement Learning",
        "PyTorch",
        "Next.js",
        "React.js",
        "TypeScript",
        "Python",
        "FastAPI",
        "WebSockets",
        "Large Language Models",
        "Autonomous Agents",
        "Computer Vision"
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "https://sedhehe.vercel.app/#webpage",
      "url": "https://sedhehe.vercel.app",
      "name": "sedhehe's portfolio",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://sedhehe.vercel.app/#website",
        "name": "sedhehe's portfolio",
        "url": "https://sedhehe.vercel.app"
      },
      "about": { "@id": "https://sedhehe.vercel.app/#person" },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://sedhehe.vercel.app/assets/preview-img.png"
      }
    },
    {
      "@type": "ItemList",
      "@id": "https://sedhehe.vercel.app/#projects",
      "name": "Featured Engineering Projects by Vivek Rallapally",
      "itemListElement": [
        {
          "@type": "SoftwareSourceCode",
          "name": "Smart Traffic Management System Using YOLOv11 and GBML DQN",
          "description":
            "Deep-Q-Network reinforcement learning agent using YOLOv11 computer vision in SUMO simulation, reducing average queue length by ~36%.",
          "programmingLanguage": ["Python", "PyTorch"],
          "codeRepository":
            "https://github.com/sedhehe/Smart_Traffic_Management_System_Using_YOLOv11_and_GBML_DQN",
          "author": { "@id": "https://sedhehe.vercel.app/#person" }
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "SED (System Execution Dashboard)",
          "description":
            "Local AI-powered laptop automation system using Python, FastAPI, Next.js, and TypeScript with real-time WebSocket communication and local LLM tool chaining.",
          "programmingLanguage": ["Python", "FastAPI", "Next.js", "TypeScript"],
          "author": { "@id": "https://sedhehe.vercel.app/#person" }
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "PXP-FraudNet",
          "description":
            "Custom 3-layer neural network model for payment fraud detection with a real-time React visualization dashboard.",
          "programmingLanguage": ["Python", "PyTorch", "React.js"],
          "author": { "@id": "https://sedhehe.vercel.app/#person" }
        },
        {
          "@type": "SoftwareSourceCode",
          "name": "XTree",
          "description":
            "Chrome extension to scrape websites and save data directly into Excel/CSV, streamlining data collection workflows.",
          "programmingLanguage": ["JavaScript", "HTML", "Python"],
          "codeRepository": "https://github.com/sedhehe/XTree",
          "author": { "@id": "https://sedhehe.vercel.app/#person" }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${sourceCodeProSans.variable} ${sourceCodeProMono.variable} font-sans antialiased text-textColor bg-background min-h-screen selection:bg-primary/20 selection:text-primary`}
      >
        <AsciiBackground />
        <HashScrollHandler />
        <Navbar />
        <main id="main-content" className="relative z-10 w-full overflow-x-hidden">
          {children}
        </main>
        <ScrollToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
