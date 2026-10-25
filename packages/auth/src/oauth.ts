import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { eq } from "drizzle-orm";

import { findAuthUserIdByEmail, getDb, profiles } from "@repo/db";

import { readAdminEmails } from "./session";
import { createAdminClient, readPublicKeys } from "./supabase";

/**
 * 카카오·구글 로그인. 앱의 `/auth/{provider}`, `/auth/{provider}/callback` 라우트가 부른다.
 * 콜백 주소는 요청한 앱의 origin 기준이라, 앱마다 콘솔에 리다이렉트 주소를 등록한다.
 */

/**
 * constants
 */
const STATE_COOKIE = "oauth_state";

const NEXT_COOKIE = "oauth_next";

const AUTHORIZE_URL: Record<Provider, string> = {
  kakao: "https://kauth.kakao.com/oauth/authorize",
  google: "https://accounts.google.com/o/oauth2/v2/auth",
};

/**
 * types
 */
export type Provider = "kakao" | "google";

type Identity = {
  provider: Provider;
  providerUserId: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
};

type OAuthParams = {
  request: Request;
  provider: Provider;
  loginPath: string;
};

type ReadIdentityParams = {
  code: string;
  redirectUri: string;
};

type SaveProfileParams = {
  identity: Identity;
  userId: string;
};

type EstablishSessionParams = {
  identity: Identity;
  response: NextResponse;
};

/**
 * actions
 */
export const beginOAuth = (params: OAuthParams) => {
  const { request, provider, loginPath } = params;
  const origin = readOrigin(request);
  const clientId =
    provider === "kakao"
      ? process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
      : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return redirectWithError({
      origin,
      loginPath,
      message: "로그인 키가 설정되지 않았습니다.",
    });
  }
  const state = crypto.randomUUID();
  const nextPath = new URL(request.url).searchParams.get("next");
  const authorize = new URL(AUTHORIZE_URL[provider]);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set(
    "redirect_uri",
    readRedirectUri({ origin, provider }),
  );
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
  const options = readCookieOptions(origin);
  response.cookies.set(STATE_COOKIE, state, options);
  response.cookies.set(
    NEXT_COOKIE,
    nextPath?.startsWith("/") ? nextPath : "/",
    options,
  );
  return response;
};

export const finishOAuth = async (params: OAuthParams) => {
  const { request, provider, loginPath } = params;
  const requestUrl = new URL(request.url);
  const origin = readOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const providerError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;
  const nextPath = cookieStore.get(NEXT_COOKIE)?.value || "/";
  if (providerError) {
    return redirectWithError({ origin, loginPath, message: providerError });
  }
  if (!code || !state || state !== expectedState) {
    return redirectWithError({
      origin,
      loginPath,
      message: "로그인 요청을 확인하지 못했습니다. 다시 시도해 주세요.",
    });
  }
  try {
    const redirectUri = readRedirectUri({ origin, provider });
    const identity =
      provider === "kakao"
        ? await readKakaoIdentity({ code, redirectUri })
        : await readGoogleIdentity({ code, redirectUri });
    const response = NextResponse.redirect(`${origin}${nextPath}`);
    await establishSession({ identity, response });
    response.cookies.delete(STATE_COOKIE);
    response.cookies.delete(NEXT_COOKIE);
    return response;
  } catch (error) {
    return redirectWithError({
      origin,
      loginPath,
      message:
        error instanceof Error ? error.message : "로그인에 실패했습니다.",
    });
  }
};

/**
 * utils
 */
export const readOrigin = (request: Request): string => {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return new URL(request.url).origin;
};

const readRedirectUri = (params: { origin: string; provider: Provider }) =>
  `${params.origin}/auth/${params.provider}/callback`;

const readCookieOptions = (origin: string) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: origin.startsWith("https"),
  path: "/",
  maxAge: 60 * 10,
});

const redirectWithError = (params: {
  origin: string;
  loginPath: string;
  message: string;
}) => {
  const { origin, loginPath, message } = params;
  const response = NextResponse.redirect(
    `${origin}${loginPath}?error=${encodeURIComponent(message)}`,
  );
  response.cookies.delete(STATE_COOKIE);
  response.cookies.delete(NEXT_COOKIE);
  return response;
};

const readKakaoIdentity = async (
  params: ReadIdentityParams,
): Promise<Identity> => {
  const { code, redirectUri } = params;
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  if (!clientId) {
    throw new Error("카카오 REST API 키가 없습니다.");
  }
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
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

const readGoogleIdentity = async (
  params: ReadIdentityParams,
): Promise<Identity> => {
  const { code, redirectUri } = params;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_SECRET이 없습니다. 구글 콘솔의 클라이언트 보안 비밀번호를 넣어 주세요.",
    );
  }
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });
  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string;
    error_description?: string;
  };
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(
      tokenPayload.error_description ?? "구글 토큰을 받지 못했습니다.",
    );
  }
  const profileResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${tokenPayload.access_token}` } },
  );
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

const saveProfile = async (params: SaveProfileParams) => {
  const { identity, userId } = params;
  const db = getDb();
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);
  const current = existing[0];
  const isPromoted = Boolean(
    identity.email && readAdminEmails().includes(identity.email.toLowerCase()),
  );
  const role = isPromoted ? "admin" : (current?.role ?? "member");
  if (current) {
    await db
      .update(profiles)
      .set({
        email: identity.email ?? current.email,
        name: identity.name,
        avatarUrl: identity.avatarUrl,
        role,
      })
      .where(eq(profiles.id, userId));
    return;
  }
  await db.insert(profiles).values({
    id: userId,
    email: identity.email,
    name: identity.name,
    avatarUrl: identity.avatarUrl,
    provider: identity.provider,
    providerUserId: identity.providerUserId,
    role,
  });
};

const establishSession = async (params: EstablishSessionParams) => {
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
    userId = created.data.user?.id ?? (await findAuthUserIdByEmail({ email }));
    if (!userId) {
      throw new Error(created.error?.message ?? "사용자를 만들지 못했습니다.");
    }
  }
  await saveProfile({ identity, userId });
  const link = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const tokenHash = link.data.properties?.hashed_token;
  if (link.error || !tokenHash) {
    throw new Error(link.error?.message ?? "세션을 만들지 못했습니다.");
  }
  const { url, key } = readPublicKeys();
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
