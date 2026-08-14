import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // This is an optimistic check only. Server pages and route handlers validate
  // the signed session and the backing user record before serving private data.
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const protectedPrefixes = [
    "/dashboard", "/profile", "/skills", "/evidence", "/projects",
    "/career", "/roadmap", "/analytics", "/assessments", "/github",
    "/settings", "/onboarding",
  ];

  if (protectedPrefixes.some((prefix) => req.nextUrl.pathname.startsWith(prefix)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
