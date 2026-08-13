"use client";
import Link from "next/link";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  userInitials?: string;
  userImage?: string;
  username?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  actions,
  userInitials = "?",
  userImage,
  username,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {actions}

        {username && (
          <Link
            href={`/passport/${username}`}
            className="btn btn-secondary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🔗</span> Passport
          </Link>
        )}

        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "white",
            flexShrink: 0,
            overflow: "hidden",
            border: "2px solid rgba(99,102,241,0.25)",
            boxShadow: "0 0 10px rgba(99,102,241,0.2)",
          }}
        >
          {userImage ? (
            <img
              src={userImage}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            userInitials
          )}
        </div>
      </div>
    </header>
  );
}
