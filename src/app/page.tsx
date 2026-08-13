"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Target,
  Compass,
  Share2,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  Award,
  Zap,
  BarChart3,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Flame,
  Check,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    color: "#6366f1",
    title: "Evidence-Based Verification",
    desc: "AI deep-scans your GitHub repositories, uploaded certificates, production code, and assessments — computing objective confidence scores.",
  },
  {
    icon: Target,
    color: "#8b5cf6",
    title: "Real-Time Career Match",
    desc: "Instant alignment percentage against industry roles (Full Stack, ML Engineer, DevOps) with exact missing & weak skill breakdown.",
  },
  {
    icon: Compass,
    color: "#22d3ee",
    title: "AI Learning Roadmaps",
    desc: "Generates custom, week-by-week sprint plans complete with curated documentation & project tasks to systematically close your skill gaps.",
  },
  {
    icon: BarChart3,
    color: "#10b981",
    title: "Skill Radar Analytics",
    desc: "Multi-dimensional visual matrix categorizing your proficiency across Frontend, Backend, Cloud Infrastructure, Data Engineering, and Soft Skills.",
  },
  {
    icon: Share2,
    color: "#f59e0b",
    title: "Verified Public Passport",
    desc: "A tamper-resistant, sleek public profile hosted at skillpassport.app/p/username for instant sharing with recruiters, hiring managers, and teams.",
  },
  {
    icon: BrainCircuit,
    color: "#f43f5e",
    title: "Interactive AI Assessments",
    desc: "Take adaptive technical assessments with real-time feedback loops to level up your verified badge levels from Beginner to Expert.",
  },
];

const DEMO_SKILLS = [
  { name: "React & Next.js", level: "Advanced", score: 94, category: "Frontend", color: "#6366f1" },
  { name: "Python / FastAPI", level: "Advanced", score: 89, category: "Backend", color: "#8b5cf6" },
  { name: "Machine Learning", level: "Intermediate", score: 76, category: "AI/ML", color: "#22d3ee" },
  { name: "Docker & K8s", level: "Intermediate", score: 68, category: "DevOps", color: "#10b981" },
  { name: "PostgreSQL & Mongo", level: "Advanced", score: 85, category: "Database", color: "#f59e0b" },
];

const DEMO_GAPS = [
  { skill: "TypeScript Generics", current: "Intermediate", target: "Advanced", priority: "High", gap: 75 },
  { skill: "System Architecture", current: "Elementary", target: "Intermediate", priority: "Critical", gap: 60 },
  { skill: "CI/CD Pipelines", current: "Beginner", target: "Intermediate", priority: "Medium", gap: 40 },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"passport" | "gap" | "roadmap">("passport");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#f0f0ff", overflowX: "hidden" }}>
      {/* ── AMBIENT BACKGROUND GLOWS ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: ["-10%", "10%", "-10%"],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-15%",
            left: "20%",
            width: "60vw",
            height: "60vw",
            maxWidth: 700,
            maxHeight: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
            y: ["0%", "15%", "0%"],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "40%",
            right: "-10%",
            width: "50vw",
            height: "50vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(16,185,129,0.05) 50%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* ── HEADER / NAVIGATION ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
          background: scrolled ? "rgba(7,7,15,0.85)" : "rgba(7,7,15,0.4)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #6366f1",
                boxShadow: "0 0 15px rgba(99,102,241,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/logo.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", color: "#ffffff" }}>
              Skill<span style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Passport</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/passport/alex-chen"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#9394a5",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 8,
                transition: "color 0.2s",
              }}
            >
              Explore Passport
            </Link>
            <Link
              href="/login"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#f0f0ff",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                padding: "10px 22px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              Create Passport <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center", textAlign: "left" }}>
          
          {/* Left Column (Hero copy) */}
          <div>
            {/* Top Floating Pill */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: "inline-block", marginBottom: 20 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 18px",
                  borderRadius: 99,
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#818cf8",
                }}
              >
                <Zap size={14} className="text-indigo-400 animate-pulse" />
                SkillPassport - AI Powered Concept Licence
              </div>
            </motion.div>

            {/* Hero Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: "clamp(38px, 5.5vw, 64px)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: 24,
                color: "#ffffff"
              }}
            >
              Your Skills.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #67e8f9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI Verified.
              </span>
              <br />
              Backed by Real Proof.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                color: "#9394a5",
                marginBottom: 40,
                lineHeight: 1.6,
              }}
            >
              Transform scattered GitHub repos, certificates, project code, and AI assessments into a{" "}
              <span style={{ color: "#f0f0ff", fontWeight: 600 }}>dynamic, tamper-proof Skill Passport</span> that proves what you can actually build.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}
            >
              <Link
                href="/register"
                style={{
                  padding: "16px 36px",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(99,102,241,0.45)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Sparkles size={18} /> Build Your Free Passport
              </Link>
              <Link
                href="/passport/alex-chen"
                style={{
                  padding: "16px 32px",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#f0f0ff",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Live Demo Profile <ChevronRight size={18} />
              </Link>
            </motion.div>

            {/* Micro Guarantee Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#5c5d6e" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={14} color="#10b981" /> No Credit Card Required
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={14} color="#10b981" /> Free MongoDB Atlas Backend
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={14} color="#10b981" /> Real-Time AI Gap Analysis
              </span>
            </motion.div>
          </div>

          {/* Right Column (Hero Video & Interactive Showcase) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: "flex", justifyContent: "center", position: "relative" }}
          >
            {/* Ambient Background Glow for Hero Media */}
            <div
              style={{
                position: "absolute",
                width: "90%",
                height: "90%",
                background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(34,211,238,0.15) 50%, transparent 75%)",
                filter: "blur(50px)",
                zIndex: 0,
              }}
            />

            {/* Video Background / Interactive Media Frame */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.02 }}
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(99,102,241,0.25)",
                background: "#0d0d1a",
                width: "100%",
                maxWidth: 460,
              }}
            >
              {/* Media Header */}
              <div
                style={{
                  background: "rgba(15,15,26,0.95)",
                  padding: "12px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "#818cf8", fontFamily: "monospace" }}>
                    AI-VERIFICATION-LIVE-DEMO.mp4
                  </span>
                </div>
                <span style={{ fontSize: 10, background: "rgba(16,185,129,0.2)", color: "#10b981", padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>
                  LIVE
                </span>
              </div>

              {/* Video Stream Element */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.85) contrast(1.1)",
                  }}
                  src="https://cdn.pixabay.com/video/2021/04/12/70881-536545754_large.mp4"
                />
                
                {/* Gradient Overlay with Logo & Badges */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(13,13,26,0.95) 0%, transparent 60%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 20,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid #6366f1" }}>
                      <img src="/logo.jpg" alt="SkillPassport Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#ffffff" }}>SkillPassport Engine</div>
                      <div style={{ fontSize: 11, color: "#a78bfa" }}>Autonomous Concept Licensing v2.4</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ── INTERACTIVE LIVE PREVIEW DASHBOARD DEMO ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "20px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            borderRadius: 24,
            background: "rgba(19,19,31,0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.15)",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top Window Bar */}
          <div style={{ background: "rgba(15,15,26,0.9)", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f43f5e" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
              </div>
              <div style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#5c5d6e", display: "flex", alignItems: "center", gap: 6 }}>
                <span>skillpassport.app/p/alex-chen</span>
                <ShieldCheck size={14} color="#10b981" />
              </div>
            </div>

            {/* Interactive Demo Tabs */}
            <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => setActiveTab("passport")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "passport" ? "#6366f1" : "transparent",
                  color: activeTab === "passport" ? "#ffffff" : "#9394a5",
                  transition: "all 0.2s",
                }}
              >
                Verified Passport
              </button>
              <button
                onClick={() => setActiveTab("gap")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "gap" ? "#6366f1" : "transparent",
                  color: activeTab === "gap" ? "#ffffff" : "#9394a5",
                  transition: "all 0.2s",
                }}
              >
                AI Skill Gaps
              </button>
              <button
                onClick={() => setActiveTab("roadmap")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "roadmap" ? "#6366f1" : "transparent",
                  color: activeTab === "roadmap" ? "#ffffff" : "#9394a5",
                  transition: "all 0.2s",
                }}
              >
                AI Sprint Roadmap
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: 32 }}>
            <AnimatePresence mode="wait">
              {activeTab === "passport" && (
                <motion.div
                  key="passport"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
                    {/* Left Column: Skill Matrix */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Extracted & Verified Skills</h3>
                          <span style={{ fontSize: 13, color: "#9394a5" }}>Analyzed from 14 GitHub repos & 3 Certifications</span>
                        </div>
                        <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99, background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 700 }}>
                          ✓ AI Audit Active
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {DEMO_SKILLS.map((skill) => (
                          <div key={skill.name} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontWeight: 700, fontSize: 14 }}>{skill.name}</span>
                                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: `${skill.color}20`, color: skill.color, fontWeight: 700 }}>
                                  {skill.level}
                                </span>
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 800, color: skill.color }}>{skill.score}% Confidence</span>
                            </div>
                            <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                              <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${skill.score}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Score Summary */}
                    <div style={{ background: "rgba(99,102,241,0.06)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.2)", textAlign: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#818cf8", marginBottom: 12 }}>
                        PASSPORT MATCH SCORE
                      </div>
                      <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg, #6366f1, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        87%
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f0ff", marginTop: 8, marginBottom: 16 }}>
                        Full Stack Developer Ready
                      </div>

                      <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#9394a5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle2 size={16} color="#10b981" /> 5 Verified Production Repos
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle2 size={16} color="#10b981" /> AWS Certified Developer
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle2 size={16} color="#10b981" /> 92% MCQ Assessment Score
                        </div>
                      </div>

                      <Link
                        href="/passport/alex-chen"
                        style={{
                          display: "block",
                          marginTop: 20,
                          padding: "10px",
                          borderRadius: 8,
                          background: "#6366f1",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: 13,
                          textDecoration: "none",
                        }}
                      >
                        View Public Passport
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "gap" && (
                <motion.div
                  key="gap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Target size={20} color="#f43f5e" />
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>AI Skill Gap Breakdown for "Full Stack Developer"</h3>
                    </div>
                    <p style={{ color: "#9394a5", fontSize: 14, marginTop: 4 }}>
                      AI compared 12 target role requirements against your proven skills evidence.
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {DEMO_GAPS.map((gap) => (
                      <div key={gap.skill} style={{ background: "rgba(255,255,255,0.03)", padding: 18, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>{gap.skill}</span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              padding: "2px 10px",
                              borderRadius: 99,
                              background: gap.priority === "Critical" ? "rgba(244,63,94,0.15)" : "rgba(245,158,11,0.15)",
                              color: gap.priority === "Critical" ? "#f43f5e" : "#f59e0b",
                            }}
                          >
                            {gap.priority} Priority
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: "#9394a5", marginBottom: 10 }}>
                          Current Level: <strong style={{ color: "#f0f0ff" }}>{gap.current}</strong> → Required Level: <strong style={{ color: "#818cf8" }}>{gap.target}</strong>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${100 - gap.gap}%`, background: "linear-gradient(90deg, #6366f1, #22d3ee)", borderRadius: 99 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "roadmap" && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Compass size={20} color="#22d3ee" />
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Auto-Generated 4-Week AI Roadmap</h3>
                    </div>
                    <p style={{ color: "#9394a5", fontSize: 14, marginTop: 4 }}>
                      Step-by-step sprint plan generated specifically to bridge identified gaps.
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                    <div style={{ background: "rgba(99,102,241,0.08)", padding: 18, borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#818cf8", marginBottom: 6 }}>WEEK 1</div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>TypeScript Deep Dive</div>
                      <p style={{ fontSize: 12, color: "#9394a5", lineHeight: 1.5 }}>Master generics, utility types, and strict type narrowing in production.</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: 18, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#5c5d6e", marginBottom: 6 }}>WEEK 2</div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>System Architecture</div>
                      <p style={{ fontSize: 12, color: "#9394a5", lineHeight: 1.5 }}>Design resilient microservices, caching layers, and database indexing.</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: 18, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#5c5d6e", marginBottom: 6 }}>WEEK 3</div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>CI/CD & Docker</div>
                      <p style={{ fontSize: 12, color: "#9394a5", lineHeight: 1.5 }}>Build automated GitHub Actions workflows with container deployments.</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: 18, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#5c5d6e", marginBottom: 6 }}>WEEK 4</div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Capstone Verification</div>
                      <p style={{ fontSize: 12, color: "#9394a5", lineHeight: 1.5 }}>Deploy production application & earn AI-Verified Passport Credential.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Engineered for <span style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Modern Developers</span>
          </h2>
          <p style={{ color: "#9394a5", fontSize: 16, maxWidth: 540, margin: "12px auto 0" }}>
            Everything you need to quantify, verify, and demonstrate your engineering capability.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{
                  background: "rgba(19,19,31,0.6)",
                  borderRadius: 16,
                  padding: 28,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={f.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#f0f0ff" }}>{f.title}</h3>
                  <p style={{ color: "#9394a5", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              borderRadius: 28,
              padding: "60px 40px",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(34,211,238,0.05) 100%)",
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow: "0 20px 60px rgba(99,102,241,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>
              Ready to Claim Your <span style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Skill Passport?</span>
            </h2>
            <p style={{ color: "#9394a5", fontSize: 16, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.6 }}>
              Join developers, students, and engineers using evidence-backed skill profiles to advance their careers.
            </p>

            <Link
              href="/register"
              style={{
                padding: "16px 40px",
                borderRadius: 12,
                fontSize: 17,
                fontWeight: 800,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                textDecoration: "none",
                boxShadow: "0 8px 30px rgba(99,102,241,0.5)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              Get Started for Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "32px 24px", color: "#5c5d6e", fontSize: 13, textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color="#6366f1" />
            <span style={{ fontWeight: 700, color: "#9394a5" }}>SkillPassport</span> © 2025. Built for AI-Driven Career Growth.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/login" style={{ color: "#9394a5", textDecoration: "none" }}>Sign In</Link>
            <Link href="/register" style={{ color: "#9394a5", textDecoration: "none" }}>Register</Link>
            <Link href="/passport/alex-chen" style={{ color: "#9394a5", textDecoration: "none" }}>Demo Passport</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
