import { NextResponse } from "next/server";

import { collectPress } from "@lib/pressCollector";

/**
 * Vercel Cron이 매일 부르는 언론보도 수집. `Authorization: Bearer ${CRON_SECRET}`만 받는다
 */
export const GET = async (request: Request) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await collectPress();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "collect failed" },
      { status: 500 },
    );
  }
};
