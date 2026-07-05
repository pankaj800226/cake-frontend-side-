import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");

  console.log("Token:", token);


  console.log(req.cookies.getAll());
  

  if (!token?.value) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/allProduct",
    "/cakes",
    "/AllCakes",
    "/CategoryFilter",
  ],
};