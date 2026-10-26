import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionProfile } from "@repo/auth/session";
import Button from "@repo/ui/components/button";
import SocialLogo from "@repo/ui/components/socialLogo";

import PageIntro from "@components/pageIntro";

export const metadata: Metadata = {
  title: "로그인",
  robots: { index: false, follow: false },
};

/**
 * types
 */
type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

type ProviderSectionProps = {
  nextPath: string;
};

/**
 * screen — 카카오·구글 로그인. 로그인하면 돌아갈 곳(없으면 홈)으로, 이미 로그인했으면 마이페이지로 보낸다
 */
const LoginScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const nextPath =
    params.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : null;
  const user = await getSessionProfile();
  if (user) {
    redirect(nextPath ?? "/mypage");
  }
  // render
  return (
    <section className="page-auth flex flex-col gap-6 py-20">
      <PageIntro title="로그인" lead="원하시는 로그인 방법을 선택해 주세요." />
      {params.error ? (
        <p className="rounded-xlarge border border-beige bg-white px-4 py-3 text-4 leading-5 text-pine-deep">
          {params.error}
        </p>
      ) : null}
      <ProviderSection nextPath={nextPath ?? "/"} />
    </section>
  );
};

/**
 * section
 */
const ProviderSection = ({ nextPath }: ProviderSectionProps) => (
  <div className="flex flex-col gap-3">
    <Button
      variant="solid"
      color="kakao"
      text="카카오로 로그인"
      leftChildren={<SocialLogo provider="kakao" />}
      href={`/auth/kakao?next=${encodeURIComponent(nextPath)}`}
      isRound
      isFullWidth
    />
    <Button
      variant="line"
      color="paper"
      text="구글로 로그인"
      leftChildren={<SocialLogo provider="google" />}
      href={`/auth/google?next=${encodeURIComponent(nextPath)}`}
      isRound
      isFullWidth
    />
  </div>
);

export default LoginScreen;
