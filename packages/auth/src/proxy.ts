import {
  type GetAllCookies,
  type SetAllCookies,
  createServerClient,
} from "@supabase/ssr";

import { readPublicKeys } from "./supabase";

/**
 * 요청마다 만료된 로그인 토큰을 새로 받아 쿠키에 쓴다. 각 앱 `proxy.ts`에서 부른다.
 * 서버 컴포넌트는 쿠키를 쓰지 못해, 여기서 갱신하지 않으면 바뀐 토큰을 잃고 세션이 끊긴다
 */

/**
 * types
 */
type RefreshSessionParams = {
  readCookies: GetAllCookies;
  writeCookies: SetAllCookies;
};

/**
 * actions
 */
export const refreshSession = async (params: RefreshSessionParams) => {
  const { readCookies, writeCookies } = params;
  const { url, key } = readPublicKeys();
  const supabase = createServerClient(url, key, {
    cookies: { getAll: readCookies, setAll: writeCookies },
  });
  await supabase.auth.getClaims();
};
