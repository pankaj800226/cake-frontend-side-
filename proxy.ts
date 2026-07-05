// 📁 middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");
  const path = req.nextUrl.pathname;

  // ✅ Home page PUBLIC (no login required)
  if (path === "/") {
    console.log("🏠 Home - PUBLIC");
    return NextResponse.next();
  }

  // ✅ Login page PUBLIC
  if (path === "/login") {
    return NextResponse.next();
  }

  // ✅ Protected routes - Token VALUE check
  if (!token?.value) {
    console.log("🔴 Redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/",
    "/cakes/:path*",
  ],
};