import { finishOAuth } from "@/lib/oauth";

export const GET = (request: Request) => finishOAuth(request, "google");
