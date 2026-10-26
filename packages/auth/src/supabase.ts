import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트. 서버에서만 쓴다.
 */

/**
 * utils
 */
export const readPublicKeys = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error("Supabase 공개 키가 없습니다.");
  }
  return { url, key };
};

/**
 * 요청 쿠키로 로그인 세션을 읽고 쓰는 클라이언트
 */
export const createServerSupabase = async () => {
  const { url, key } = readPublicKeys();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // 서버 컴포넌트 렌더 중에는 쿠키를 쓸 수 없다. 읽기만 하고 넘긴다
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          return;
        }
      },
    },
  });
};

/**
 * 서비스 롤 클라이언트. 사용자 생성·삭제, 스토리지 업로드에 쓴다
 */
export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase 서비스 롤 설정이 없습니다.");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
