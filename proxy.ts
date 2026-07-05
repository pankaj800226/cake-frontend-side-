// 📁 middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  console.log("🚀 PROXY");
  console.log("📌 Path:", path);
  
  if (path === "/login") {
    return NextResponse.next();
  }
  
  const token = req.cookies.get("userToken");
  
  if (!token?.value) {
    console.log("🔴 Redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
}

export default proxy;

// ✅ USE THIS (works for all routes including /)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};