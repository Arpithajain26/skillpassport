"use client";
import Link from "next/link";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  userInitials?: string;
  username?: string;
}

export function DashboardHeader({ title, subtitle, actions, userInitials = "?", username }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {actions}

        {username && (
          <Link
            href={`/passport/${username}`}
            className="btn btn-secondary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 My Passport
          </Link>
        )}

        <div
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
            cursor: "pointer",
          }}
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
