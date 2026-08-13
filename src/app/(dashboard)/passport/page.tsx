import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyPassportRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const username = (session.user as any).username;
  if (username) redirect(`/passport/${username}`);
  redirect("/profile");
}
