import { finishOAuth } from "@repo/auth/oauth";

export const GET = (request: Request) =>
  finishOAuth({ request, loginPath: "/login" });
