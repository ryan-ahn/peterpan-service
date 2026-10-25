import { beginOAuth } from "@repo/auth/oauth";

export const GET = (request: Request) =>
  beginOAuth({ request, provider: "kakao", loginPath: "/login" });
