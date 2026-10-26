import { type NextRequest, NextResponse } from "next/server";

import { refreshSession } from "@repo/auth/proxy";

/**
 * proxy — 페이지·서버 액션 요청마다 로그인 토큰을 갱신한다
 */
const proxy = async (request: NextRequest) => {
  let response = NextResponse.next({ request });
  await refreshSession({
    readCookies: () => request.cookies.getAll(),
    writeCookies: (cookiesToSet, headers) => {
      cookiesToSet.forEach(({ name, value }) => {
        request.cookies.set(name, value);
      });
      response = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      Object.entries(headers).forEach(([name, value]) => {
        response.headers.set(name, value);
      });
    },
  });
  return response;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
  ],
};

export default proxy;
