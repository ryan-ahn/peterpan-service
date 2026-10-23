import { beginOAuth } from "@/lib/oauth";

export const GET = (request: Request) => beginOAuth(request, "kakao");
