"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/profile", icon: "👤", label: "My Profile" },
  { href: "/skills", icon: "⚡", label: "Skills" },
  { href: "/evidence", icon: "📁", label: "Evidence" },
  { href: "/projects", icon: "🗂️", label: "Projects" },
  { href: "/github", icon: "🐙", label: "GitHub" },
];

const CAREER_ITEMS = [
  { href: "/career", icon: "🎯", label: "Career Goals" },
  { href: "/roadmap", icon: "🗺️", label: "Learning Roadmap" },
  { href: "/assessments", icon: "📝", label: "Assessments" },
  { href: "/analytics", icon: "📊", label: "Analytics" },
];

const OTHER_ITEMS = [
  { href: "/passport", icon: "🎓", label: "My Passport" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
];

interface SidebarProps {
  username?: string;
}

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
        <span>
          Skill<span className="gradient-text" style={{ WebkitTextFillColor: "unset", background: "none", color: "#818cf8" }}>Passport</span>
        </span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Main</div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${isActive(item.href) ? "active" : ""}`}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="sidebar-section-title" style={{ marginTop: 8 }}>Career</div>
        {CAREER_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${isActive(item.href) ? "active" : ""}`}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="sidebar-section-title" style={{ marginTop: 8 }}>Account</div>
        {OTHER_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${isActive(item.href) ? "active" : ""}`}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {username && (
          <div style={{ marginBottom: 10, padding: "8px 12px", background: "var(--bg-glass)", borderRadius: 8, fontSize: 12 }}>
            <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>Public passport</div>
            <div style={{ color: "var(--primary-light)", fontWeight: 600 }}>
              /p/{username}
            </div>
          </div>
        )}
        <button
          className="sidebar-item"
          style={{ width: "100%", cursor: "pointer", border: "none", background: "none" }}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
