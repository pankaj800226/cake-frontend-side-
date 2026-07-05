// 📁 middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");
  const path = req.nextUrl.pathname;


  // ✅ 1. Login page - ALWAYS allow (infinite loop se bachne ke liye)
  if (path === "/login") {
    console.log("🟢 Login page - ALLOWING");
    return NextResponse.next();
  }

  // ✅ 2. Sirf /cakes routes check karo
  if (path.startsWith("/cakes")) {
    if (!token?.value) {
      console.log("🔴 No token - Redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    console.log("🟢 Token valid - Allowing access");
  }

  // ✅ 3. Baaki sab routes (home, etc.) - ALLOW
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/cakes/:path*",  // ✅ Sirf cakes catch karo
  ],
};