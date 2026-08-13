import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateFull(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getConfidenceColor(score: number): string {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-cyan-400";
  if (score >= 55) return "text-amber-400";
  return "text-rose-400";
}

export function getConfidenceBg(score: number): string {
  if (score >= 85) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (score >= 70) return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
  if (score >= 55) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-rose-500/20 text-rose-400 border-rose-500/30";
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    Expert: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    Advanced: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    Intermediate: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Elementary: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Beginner: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return colors[level] ?? colors.Beginner;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    Critical: "text-rose-400 bg-rose-500/20 border-rose-500/30",
    High: "text-orange-400 bg-orange-500/20 border-orange-500/30",
    Medium: "text-amber-400 bg-amber-500/20 border-amber-500/30",
    Low: "text-slate-400 bg-slate-500/20 border-slate-500/30",
  };
  return colors[priority] ?? colors.Low;
}

export function getEvidenceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    project: "Project",
    github_repository: "GitHub Repo",
    certificate: "Certificate",
    coursework: "Coursework",
    internship: "Internship",
    hackathon: "Hackathon",
    coding_challenge: "Coding Challenge",
    assessment: "Assessment",
    work_sample: "Work Sample",
    simulation: "Simulation",
  };
  return labels[type] ?? type;
}

export function getEvidenceTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    project: "FolderOpen",
    github_repository: "Github",
    certificate: "Award",
    coursework: "BookOpen",
    internship: "Briefcase",
    hackathon: "Zap",
    coding_challenge: "Code2",
    assessment: "ClipboardCheck",
    work_sample: "FileText",
    simulation: "Play",
  };
  return icons[type] ?? "File";
}
