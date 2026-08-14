import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { EvidenceClient } from "./client";

const isValidUserId = (id: string) => !!id && id.length > 0;

export const metadata = { title: "Evidence" };

export default async function EvidencePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let evidence: any[] = [];
  if (isValidUserId(session.user.id)) {
    try {
      evidence = await prisma.evidence.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.warn("Evidence fetch notice:", e);
    }
  }

  const initials = (session.user.name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <DashboardHeader
        title="Evidence"
        subtitle={`${evidence.length} verified evidence items`}
        userInitials={initials}
        username={(session.user as any).username}
      />
      <main className="dashboard-content">
        <EvidenceClient evidence={evidence} />
      </main>
    </div>
  );
}
