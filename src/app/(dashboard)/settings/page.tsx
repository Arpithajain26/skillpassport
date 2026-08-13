import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Settings, Shield, Bell, Key, Database } from "lucide-react";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div>
      <DashboardHeader
        title="System Settings & Privacy"
        subtitle="Manage your account preferences, public visibility, and API configurations"
      />
      <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="card" style={{ padding: 28, background: "rgba(15, 23, 42, 0.75)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Shield size={24} color="#38bdf8" />
            <h2 className="section-title" style={{ margin: 0 }}>Passport Visibility & Sharing</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Public Passport Profile</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Allow recruiters and public visitors to view your verified passport link.</div>
            </div>
            <span className="badge badge-emerald">Public / Enabled</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>GitHub Automatic Sync</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Auto-scan commits and repositories to update confidence scores.</div>
            </div>
            <span className="badge badge-indigo">Auto Active</span>
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Database size={24} color="#34d399" />
            <h2 className="section-title" style={{ margin: 0 }}>Database & Connected Services</h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Connected to MongoDB Atlas cluster `skillpassport` with NextAuth v5 session management and Firebase Google Authentication.
          </p>
        </div>
      </main>
    </div>
  );
}
