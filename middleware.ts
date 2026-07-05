import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("userToken")?.value;
  const { pathname } = req.nextUrl;

  // 1. If the user is NOT logged in and trying to access protected routes -> redirect to /login
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. If the user IS logged in and trying to access the login page -> redirect to home (/)
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Removed 'login' from the negative lookahead so middleware handles it
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};