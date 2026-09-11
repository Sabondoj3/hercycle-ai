import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HerCycle AI — Track. Understand. Ask. Care.",
  description: "Private menstrual cycle tracking, pattern insights, health reports, and an AI companion. Educational, not diagnostic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-stone-900 antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
