import { beginOAuth } from "@repo/auth/oauth";

export const GET = (request: Request) =>
  beginOAuth({ request, provider: "google", loginPath: "/login" });
