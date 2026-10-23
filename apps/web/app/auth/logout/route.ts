import { NextResponse } from "next/server";

import { originFromRequest } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

export const POST = async (request: Request) => {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", originFromRequest(request)), 303);
};
