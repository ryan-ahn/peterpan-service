import type { Metadata } from "next";

import { getSessionProfile } from "@repo/auth/session";
import Button from "@repo/ui/components/button";

import BrandText from "@components/brandText";
import PageIntro from "@components/pageIntro";

export const metadata: Metadata = { title: "로그인" };

/**
 * constants
 */
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";

/**
 * types
 */
type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

type AccountSectionProps = {
  name: string;
  isAdmin: boolean;
};

type ProviderSectionProps = {
  nextPath: string;
};

/**
 * screen — 카카오·구글 로그인. 로그인했으면 계정과 로그아웃
 */
const LoginScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";
  const user = await getSessionProfile();
  // render
  return (
    <section className="page-auth flex flex-col gap-6 py-20">
      <PageIntro
        title="로그인"
        lead="카카오 또는 구글 계정으로 들어옵니다. 관리자로 지정된 이메일은 관리자 화면에서 게시판을 수정할 수 있습니다."
      />
      {params.error ? (
        <p className="rounded-xlarge bg-white px-4 py-3 text-4 leading-5 text-pine-deep">
          {params.error}
        </p>
      ) : null}
      {user ? (
        <AccountSection name={user.name} isAdmin={user.role === "admin"} />
      ) : (
        <ProviderSection nextPath={nextPath} />
      )}
    </section>
  );
};

/**
 * section
 */
const AccountSection = ({ name, isAdmin }: AccountSectionProps) => (
  <div className="rounded-3xlarge bg-white p-6">
    <BrandText variant="bodyCompact">
      {name} 님으로 로그인되어 있습니다.
    </BrandText>
    <div className="mt-4 flex gap-3">
      {isAdmin ? (
        <Button
          variant="solid"
          color="pine"
          size="small"
          text="관리자 화면"
          href={ADMIN_URL}
          isRound
        />
      ) : null}
      <form action="/auth/logout" method="post">
        <Button
          variant="line"
          color="paper"
          size="small"
          type="submit"
          text="로그아웃"
          isRound
        />
      </form>
    </div>
  </div>
);

const ProviderSection = ({ nextPath }: ProviderSectionProps) => (
  <div className="flex flex-col gap-3">
    <Button
      variant="solid"
      color="kakao"
      text="카카오로 로그인"
      href={`/auth/kakao?next=${encodeURIComponent(nextPath)}`}
      isRound
      isFullWidth
    />
    <Button
      variant="line"
      color="paper"
      text="구글로 로그인"
      href={`/auth/google?next=${encodeURIComponent(nextPath)}`}
      isRound
      isFullWidth
    />
  </div>
);

export default LoginScreen;
