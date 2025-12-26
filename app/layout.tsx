
import type { Metadata } from "next";
import { Source_Code_Pro } from "next/font/google";
import Navbar from "@/components/ui/navbar";
import ScrollToTop from "@/components/ui/scrollToTop";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";


const sourceCodeProSans = Source_Code_Pro({
  variable: "--font-source_code_pro-sans",
  subsets: ["latin"],
});
const sourceCodeProMono = Source_Code_Pro({
  variable: "--font-source_code_pro-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "sedhehe",
  description: "sedhehe's Portfolio Website",
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


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sourceCodeProSans.variable} ${sourceCodeProMono.variable} antialiased`}>
        <Navbar />
        {children}
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
