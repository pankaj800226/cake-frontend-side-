// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// function proxy(req: NextRequest) {
//   const token = req.cookies.get("userToken");

//   if (!token?.value) {
//     return NextResponse.redirect(
//         new URL('/login', req.url)
//     )
// }

//   return NextResponse.next();
// }

// export default proxy; 

// export const config = {
//   matcher: [
//     "/",
//     "/cakes",
//   ],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");
  const { pathname } = req.nextUrl;

  // 1. अगर टोकन नहीं है और यूजर सुरक्षित पेजों पर जाने की कोशिश कर रहा है
  if (!token?.value && (pathname === "/" || pathname === "/cakes")) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. अगर टोकन मौजूद है और यूजर फिर से /login पर जाने की कोशिश कर रहा है (लॉगिन के तुरंत बाद)
  if (token?.value && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/cakes",
    "/login", 
  ],
};
