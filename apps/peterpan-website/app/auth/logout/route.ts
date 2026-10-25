import { NextResponse } from "next/server";

import { readOrigin } from "@repo/auth/oauth";
import { signOut } from "@repo/auth/session";

export const POST = async (request: Request) => {
  await signOut();
  return NextResponse.redirect(new URL("/login", readOrigin(request)), 303);
};
