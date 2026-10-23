import { eq } from "drizzle-orm";
import { findAuthUserIdByEmail, getDb, profiles } from "@repo/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminEmails } from "@/lib/auth";
import { originFromRequest } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

type Provider = "kakao" | "google";

type Identity = {
  provider: Provider;
  providerUserId: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
};

const cookieOptions = (origin: string) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: origin.startsWith("https"),
  path: "/",
  maxAge: 60 * 10,
});

export const beginOAuth = async (request: Request, provider: Provider) => {
  const requestUrl = new URL(request.url);
  const origin = originFromRequest(request);
  const nextPath = requestUrl.searchParams.get("next");
  const state = crypto.randomUUID();
  const redirectUri = `${origin}/auth/${provider}/callback`;
  const authorize = new URL(
    provider === "kakao"
      ? "https://kauth.kakao.com/oauth/authorize"
      : "https://accounts.google.com/o/oauth2/v2/auth",
  );
  const clientId =
    provider === "kakao"
      ? process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
      : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("로그인 키가 설정되지 않았습니다.")}`,
    );
  }
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("state", state);
  if (provider === "kakao") {
    authorize.searchParams.set(
      "scope",
      "profile_nickname profile_image account_email",
    );
  }
  if (provider === "google") {
    authorize.searchParams.set("scope", "openid email profile");
    authorize.searchParams.set("prompt", "select_account");
  }
  const response = NextResponse.redirect(authorize);
  const options = cookieOptions(origin);
  response.cookies.set("oauth_state", state, options);
  response.cookies.set(
    "oauth_next",
    nextPath?.startsWith("/") ? nextPath : "/",
    options,
  );
  return response;
};

export const finishOAuth = async (request: Request, provider: Provider) => {
  const requestUrl = new URL(request.url);
  const origin = originFromRequest(request);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const providerError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const expected = cookieStore.get("oauth_state")?.value;
  const nextPath = cookieStore.get("oauth_next")?.value || "/";
  const fail = (message: string) => {
    const response = NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(message)}`,
    );
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_next");
    return response;
  };
  if (providerError) {
    return fail(providerError);
  }
  if (!code || !state || state !== expected) {
    return fail("로그인 요청을 확인하지 못했습니다. 다시 시도해 주세요.");
  }
  try {
    const redirectUri = `${origin}/auth/${provider}/callback`;
    const identity =
      provider === "kakao"
        ? await readKakao({ code, redirectUri })
        : await readGoogle({ code, redirectUri });
    const response = NextResponse.redirect(`${origin}${nextPath}`);
    await establishSession({ identity, response });
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_next");
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "로그인에 실패했습니다.";
    return fail(message);
  }
};

const readKakao = async (params: { code: string; redirectUri: string }): Promise<Identity> => {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  if (!clientId) {
    throw new Error("카카오 REST API 키가 없습니다.");
  }
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: params.redirectUri,
    code: params.code,
  });
  const secret = process.env.KAKAO_CLIENT_SECRET;
  if (secret) {
    body.set("client_secret", secret);
  }
  const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string;
    error_description?: string;
  };
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(
      tokenPayload.error_description ??
        "카카오 토큰을 받지 못했습니다. 클라이언트 시크릿이 필요하면 KAKAO_CLIENT_SECRET을 넣어 주세요.",
    );
  }
  const profileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
  });
  const profile = (await profileResponse.json()) as {
    id?: number;
    kakao_account?: {
      email?: string;
      profile?: { nickname?: string; profile_image_url?: string };
    };
  };
  if (!profile.id) {
    throw new Error("카카오 프로필을 읽지 못했습니다.");
  }
  return {
    provider: "kakao",
    providerUserId: String(profile.id),
    email: profile.kakao_account?.email ?? null,
    name: profile.kakao_account?.profile?.nickname || "카카오 회원",
    avatarUrl: profile.kakao_account?.profile?.profile_image_url ?? null,
  };
};

const readGoogle = async (params: {
  code: string;
  redirectUri: string;
}): Promise<Identity> => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_SECRET이 없습니다. 구글 콘솔의 클라이언트 보안 비밀번호를 넣어 주세요.");
  }
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: params.redirectUri,
      code: params.code,
    }),
  });
  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string;
    error_description?: string;
  };
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(tokenPayload.error_description ?? "구글 토큰을 받지 못했습니다.");
  }
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
  });
  const profile = (await profileResponse.json()) as {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
  };
  if (!profile.sub) {
    throw new Error("구글 프로필을 읽지 못했습니다.");
  }
  return {
    provider: "google",
    providerUserId: profile.sub,
    email: profile.email ?? null,
    name: profile.name || "구글 회원",
    avatarUrl: profile.picture ?? null,
  };
};

const establishSession = async (params: { identity: Identity; response: NextResponse }) => {
  const { identity, response } = params;
  const email =
    identity.email ??
    `${identity.provider}.${identity.providerUserId}@users.peterpanfoundation.kr`;
  const admin = createAdminClient();
  let userId = await findAuthUserIdByEmail({ email });
  if (!userId) {
    const created = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name: identity.name,
        avatar_url: identity.avatarUrl,
        provider: identity.provider,
      },
    });
    if (created.error || !created.data.user) {
      userId = await findAuthUserIdByEmail({ email });
      if (!userId) {
        throw new Error(created.error?.message ?? "사용자를 만들지 못했습니다.");
      }
    } else {
      userId = created.data.user.id;
    }
  }
  const db = getDb();
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);
  const promoted =
    identity.email && adminEmails().includes(identity.email.toLowerCase())
      ? "admin"
      : null;
  const role = promoted ?? existing[0]?.role ?? "member";
  if (existing[0]) {
    await db
      .update(profiles)
      .set({
        email: identity.email ?? existing[0].email,
        name: identity.name,
        avatarUrl: identity.avatarUrl,
        role,
      })
      .where(eq(profiles.id, userId));
  } else {
    await db.insert(profiles).values({
      id: userId,
      email: identity.email,
      name: identity.name,
      avatarUrl: identity.avatarUrl,
      provider: identity.provider,
      providerUserId: identity.providerUserId,
      role,
    });
  }
  const link = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const tokenHash = link.data.properties?.hashed_token;
  if (link.error || !tokenHash) {
    throw new Error(link.error?.message ?? "세션을 만들지 못했습니다.");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error("Supabase 공개 키가 없습니다.");
  }
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return response.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
  const verified = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "magiclink",
  });
  if (verified.error) {
    throw new Error(verified.error.message);
  }
};
