import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");
  const path = req.nextUrl.pathname;


  if (path === "/login") {
    console.log("🟢 Login - ALLOWING");
    return NextResponse.next();
  }

  if (!token?.value) {
    console.log("🔴 No token - Redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("🟢 Token valid - ALLOWING");


  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/",
    "/cakes",
  ],
};