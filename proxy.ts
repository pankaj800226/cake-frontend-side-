import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");
  // const path = req.nextUrl.pathname;


 
  if (!token) {
    return NextResponse.redirect(
        new URL('/login', req.url)
    )
}

  return NextResponse.next();
}

export default proxy; 

export const config = {
  matcher: [
    "",
    "/cakes",
  ],
};