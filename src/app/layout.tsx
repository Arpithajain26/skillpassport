import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SkillPassport - AI Powered Concept Licence",
    template: "%s | SkillPassport",
  },
  description:
    "SkillPassport transforms scattered evidence — GitHub repos, certificates, projects, assessments — into a dynamic, AI-verified professional identity that goes beyond resumes.",
  keywords: ["skills", "AI", "portfolio", "passport", "career", "verification"],
  openGraph: {
    title: "SkillPassport - AI Powered Concept Licence",
    description: "Your AI-Verified Skill Identity",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
