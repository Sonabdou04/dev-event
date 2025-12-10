// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./app/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protect user dashboard (any authenticated user)
  if (pathname.startsWith("/user")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect admin area (admin only)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    const userRole = session.user?.role || "user";    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
  ],
};