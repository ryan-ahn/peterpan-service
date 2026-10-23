import type { Metadata } from "next";
import Link from "next/link";

import { getSessionProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "로그인" };

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";
  const user = await getSessionProfile();
  return (
    <section className="mx-auto flex w-[min(480px,calc(100%-2rem))] flex-col gap-6 py-20">
      <h1 className="text-4xl font-semibold text-green">로그인</h1>
      <p className="leading-7 text-muted">
        카카오 또는 구글 계정으로 들어옵니다. 관리자로 지정된 이메일만 게시판을
        수정할 수 있습니다.
      </p>
      {params.error ? (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-green-deep">{params.error}</p>
      ) : null}
      {user ? (
        <div className="rounded-[2rem] bg-white p-6">
          <p>{user.name} 님으로 로그인되어 있습니다.</p>
          <div className="mt-4 flex gap-3 text-sm">
            {user.role === "admin" ? (
              <Link href="/admin" className="rounded-full bg-green px-4 py-2 text-white">
                관리자
              </Link>
            ) : null}
            <form action="/auth/logout" method="post">
              <button className="rounded-full border border-beige px-4 py-2" type="submit">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <a
            href={`/auth/kakao?next=${encodeURIComponent(nextPath)}`}
            className="grid h-12 place-items-center rounded-full bg-[#FEE500] font-medium text-[#191919]">
            카카오로 로그인
          </a>
          <a
            href={`/auth/google?next=${encodeURIComponent(nextPath)}`}
            className="grid h-12 place-items-center rounded-full border border-beige bg-white font-medium">
            구글로 로그인
          </a>
        </div>
      )}
    </section>
  );
};

export default LoginPage;
