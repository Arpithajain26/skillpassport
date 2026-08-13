"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  Zap,
  FolderOpen,
  Briefcase,
  GitPullRequest,
  Target,
  Compass,
  FileSpreadsheet,
  BarChart4,
  Settings,
  LogOut,
  Award,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/profile", icon: User, label: "My Profile" },
  { href: "/skills", icon: Zap, label: "Skills Catalog" },
  { href: "/evidence", icon: FolderOpen, label: "Evidence Files" },
  { href: "/projects", icon: Briefcase, label: "Projects" },
  { href: "/github", icon: GitPullRequest, label: "GitHub Repos" },
];

const CAREER_ITEMS = [
  { href: "/career", icon: Target, label: "Career Gaps" },
  { href: "/roadmap", icon: Compass, label: "AI Roadmap" },
  { href: "/assessments", icon: FileSpreadsheet, label: "Assessments" },
  { href: "/analytics", icon: BarChart4, label: "Analytics Matrix" },
];

const OTHER_ITEMS = [
  { href: "/settings", icon: Settings, label: "System Config" },
];

interface SidebarProps {
  username?: string;
  name?: string;
  image?: string;
  initials?: string;
}

export function Sidebar({ username, name, image, initials = "?" }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="sidebar" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Sidebar Logo */}
      <div className="sidebar-logo" style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 24px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1.5px solid #6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(99,102,241,0.3)",
          }}
        >
          <img src="/logo.jpg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", color: "#ffffff" }}>
          Skill<span style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Passport</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto", padding: "0 14px 20px" }}>
        <div className="sidebar-section-title" style={{ paddingLeft: 10, fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 6 }}>
          Main Panel
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? "#ffffff" : "var(--text-secondary)",
                background: active ? "rgba(99,102,241,0.12)" : "transparent",
                textDecoration: "none",
                marginBottom: 2,
              }}
            >
              <Icon size={16} color={active ? "#818cf8" : "var(--text-secondary)"} />
              {item.label}
            </Link>
          );
        })}

        <div className="sidebar-section-title" style={{ paddingLeft: 10, fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.08em", marginTop: 18, marginBottom: 6 }}>
          AI Intelligence
        </div>
        {CAREER_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? "#ffffff" : "var(--text-secondary)",
                background: active ? "rgba(99,102,241,0.12)" : "transparent",
                textDecoration: "none",
                marginBottom: 2,
              }}
            >
              <Icon size={16} color={active ? "#818cf8" : "var(--text-secondary)"} />
              {item.label}
            </Link>
          );
        })}

        <div className="sidebar-section-title" style={{ paddingLeft: 10, fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.08em", marginTop: 18, marginBottom: 6 }}>
          System Settings
        </div>
        {OTHER_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? "#ffffff" : "var(--text-secondary)",
                background: active ? "rgba(99,102,241,0.12)" : "transparent",
                textDecoration: "none",
                marginBottom: 2,
              }}
            >
              <Icon size={16} color={active ? "#818cf8" : "var(--text-secondary)"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Profile Card Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,20,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          {/* Avatar Picture or Initials */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              overflow: "hidden",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#ffffff",
              border: "1.5px solid rgba(99,102,241,0.3)",
              flexShrink: 0,
            }}
          >
            {image ? (
              <img src={image} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initials
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {name || "User Profile"}
            </div>
            {username && (
              <Link
                href={`/passport/${username}`}
                target="_blank"
                style={{
                  fontSize: 11,
                  color: "#818cf8",
                  textDecoration: "none",
                  fontWeight: 600,
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                /p/{username}
              </Link>
            )}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            background: "rgba(244,63,94,0.06)",
            border: "1px solid rgba(244,63,94,0.15)",
            borderRadius: 8,
            color: "#f43f5e",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(244,63,94,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(244,63,94,0.06)";
          }}
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
