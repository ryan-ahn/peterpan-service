import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { and, eq } from "drizzle-orm";

import { getDb, profiles } from "@repo/db";

import { readPublicKeys } from "./supabase";

/**
 * types
 */
export type Provider = "kakao" | "google";

type BeginOAuthParams = {
  request: Request;
  provider: Provider;
  loginPath: string;
};

type FinishOAuthParams = {
  request: Request;
  loginPath: string;
};

type PendingCookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};

type ProfileInput = {
  userId: string;
  provider: Provider;
  providerUserId: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
};

/**
 * actions
 */
export const beginOAuth = async (params: BeginOAuthParams) => {
  const { request, provider, loginPath } = params;
  const origin = readOrigin(request);
  const nextPath = readNextPath(new URL(request.url).searchParams.get("next"));
  try {
    const { supabase, pending } = await createAuthClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        skipBrowserRedirect: true,
      },
    });
    if (error || !data.url) {
      return redirectWithError({
        origin,
        loginPath,
        message: error?.message ?? "로그인 페이지로 이동하지 못했습니다.",
      });
    }
    return applyCookies(NextResponse.redirect(data.url), pending);
  } catch (error) {
    return redirectWithError({
      origin,
      loginPath,
      message:
        error instanceof Error
          ? error.message
          : "로그인 페이지로 이동하지 못했습니다.",
    });
  }
};

export const finishOAuth = async (params: FinishOAuthParams) => {
  const { request, loginPath } = params;
  const requestUrl = new URL(request.url);
  const origin = readOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const providerError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");
  const nextPath = readNextPath(requestUrl.searchParams.get("next"));
  if (providerError) {
    return redirectWithError({ origin, loginPath, message: providerError });
  }
  if (!code) {
    return redirectWithError({
      origin,
      loginPath,
      message: "로그인 요청을 확인하지 못했습니다. 다시 시도해 주세요.",
    });
  }
  try {
    const { supabase, pending } = await createAuthClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      return redirectWithError({
        origin,
        loginPath,
        message: error?.message ?? "로그인에 실패했습니다.",
      });
    }
    await saveProfile(readProfileInput(data.user));
    return applyCookies(NextResponse.redirect(`${origin}${nextPath}`), pending);
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

const createAuthClient = async () => {
  const cookieStore = await cookies();
  const jar = cookieStore.getAll();
  const pending = new Map<string, PendingCookie>();
  const { url, key } = readPublicKeys();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return jar;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(cookie => {
          const index = jar.findIndex(item => item.name === cookie.name);
          const nextCookie = { name: cookie.name, value: cookie.value };
          if (index >= 0) jar[index] = nextCookie;
          else jar.push(nextCookie);
          pending.set(cookie.name, cookie);
        });
      },
    },
  });
  return { supabase, pending };
};

const applyCookies = (
  response: NextResponse,
  pending: Map<string, PendingCookie>,
) => {
  pending.forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  });
  return response;
};

const readNextPath = (next: string | null) =>
  next?.startsWith("/") && !next.startsWith("//") ? next : "/";

const readProvider = (value: string | undefined): Provider | null => {
  if (value === "kakao" || value === "google") return value;
  return null;
};

const readText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const readOAuthIdentity = (user: User) => {
  const oauthIdentities = (user.identities ?? []).filter(item =>
    readProvider(item.provider),
  );
  if (oauthIdentities.length === 0) {
    return null;
  }
  const sorted = [...oauthIdentities].sort((left, right) => {
    const leftAt = left.last_sign_in_at ? Date.parse(left.last_sign_in_at) : 0;
    const rightAt = right.last_sign_in_at
      ? Date.parse(right.last_sign_in_at)
      : 0;
    return rightAt - leftAt;
  });
  const latest = sorted[0]!;
  if (latest.last_sign_in_at) {
    return latest;
  }
  const primary = readProvider(
    typeof user.app_metadata?.provider === "string"
      ? user.app_metadata.provider
      : undefined,
  );
  if (primary) {
    const matched = oauthIdentities.find(item => item.provider === primary);
    if (matched) {
      return matched;
    }
  }
  return oauthIdentities[0];
};

const readProfileInput = (user: User): ProfileInput => {
  const identity = readOAuthIdentity(user);
  const provider = readProvider(identity?.provider);
  if (!identity || !provider) {
    throw new Error("로그인 계정을 확인하지 못했습니다.");
  }
  const data = identity.identity_data ?? {};
  const providerUserId =
    readText(data.provider_id) ?? readText(data.sub) ?? identity.id;
  if (!providerUserId) {
    throw new Error("로그인 계정을 확인하지 못했습니다.");
  }
  return {
    userId: user.id,
    provider,
    providerUserId,
    email: readText(user.email) ?? readText(data.email),
    name:
      readText(data.full_name) ??
      readText(data.name) ??
      readText(data.preferred_username) ??
      (provider === "kakao" ? "카카오 회원" : "구글 회원"),
    avatarUrl: readText(data.avatar_url) ?? readText(data.picture),
  };
};

/**
 * 처음 가입하면 소셜 계정의 이름·사진·이메일로 profiles 행을 만든다. 이미 있으면 회원이 고친 값을 지키고 비어 있는 칸만 채운다
 */
const saveProfile = async (input: ProfileInput) => {
  const db = getDb();
  const byId = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, input.userId))
    .limit(1);
  const linked = byId[0]
    ? null
    : (
        await db
          .select()
          .from(profiles)
          .where(
            and(
              eq(profiles.provider, input.provider),
              eq(profiles.providerUserId, input.providerUserId),
            ),
          )
          .limit(1)
      )[0];
  const current = byId[0] ?? linked;
  if (!current) {
    await db.insert(profiles).values({
      id: input.userId,
      email: input.email,
      name: input.name,
      avatarUrl: input.avatarUrl,
      provider: input.provider,
      providerUserId: input.providerUserId,
    });
    return;
  }
  const nextProfile = {
    email: current.email ?? input.email,
    name: current.name || input.name,
    avatarUrl: current.avatarUrl ?? input.avatarUrl,
    provider: input.provider,
    providerUserId: input.providerUserId,
  };
  await db
    .update(profiles)
    .set(
      current.id === input.userId
        ? nextProfile
        : { id: input.userId, ...nextProfile },
    )
    .where(eq(profiles.id, current.id));
};

const redirectWithError = (params: {
  origin: string;
  loginPath: string;
  message: string;
}) => {
  const { origin, loginPath, message } = params;
  return NextResponse.redirect(
    `${origin}${loginPath}?error=${encodeURIComponent(message)}`,
  );
};
