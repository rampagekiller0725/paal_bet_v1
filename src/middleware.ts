import { NextRequest, NextResponse } from "next/server";

export default function middlware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('next-url', req.nextUrl.pathname);
  res.headers.set('network', req.nextUrl.searchParams.get('network') ?? '10');
  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.*).*)',
  ],
}