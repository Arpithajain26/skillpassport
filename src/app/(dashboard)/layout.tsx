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

  let userName = session.user.name ?? "User";
  let userUsername: string | undefined = (session.user as any).username;
  let userImage: string | undefined = session.user.image ?? undefined;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, username: true, image: true },
    });

    if (dbUser) {
      userName = dbUser.name ?? userName;
      userUsername = dbUser.username || userUsername;
      userImage = dbUser.image || userImage;
    }
  } catch (error) {
    console.warn("Dashboard layout: DB fetch failed, using session data", error);
  }

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
      <div className="dashboard-container">
        {children}
      </div>
    </div>
  );
}
