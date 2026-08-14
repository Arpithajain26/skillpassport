import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | SkillPassport",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const isValidUserId = (value: string) => !!value && value.length > 0;
  if (!isValidUserId(session.user.id)) {
    console.warn("Blocked invalid session user id:", session.user.id);
    redirect("/login");
  }

  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, username: true, image: true },
    });
  } catch (error) {
    console.error("Dashboard layout: unable to validate session user", error);
    redirect("/login");
  }

  // A signed cookie alone is not enough: it must point to a real account.
  if (!dbUser) redirect("/login");

  const userName = dbUser.name ?? session.user.name ?? "User";
  const userUsername = dbUser.username || (session.user as any).username;
  const userImage = dbUser.image || session.user.image || undefined;

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <Sidebar
        username={userUsername}
        name={userName}
        image={userImage}
        initials={initials}
      />
      <div className="dashboard-container">{children}</div>
    </div>
  );
}
