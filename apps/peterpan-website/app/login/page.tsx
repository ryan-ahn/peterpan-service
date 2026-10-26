import type { ReactNode } from "react";

import type { Metadata } from "next";

import { getSessionProfile } from "@repo/auth/session";
import Button from "@repo/ui/components/button";
import Icon from "@repo/ui/icon";

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
};

type ProviderSectionProps = {
  nextPath: string;
};

type PanelProps = {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
};

/**
 * screen — 카카오·구글 로그인. 로그인했으면 계정·로그아웃, 운영자는 관리자 화면 바로가기
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
        title={user ? "내 계정" : "로그인"}
        lead={
          user
            ? "로그인한 계정을 확인하고 관리할 수 있습니다."
            : "원하시는 로그인 방법을 선택해 주세요."
        }
      />
      {params.error ? (
        <p className="rounded-xlarge bg-white px-4 py-3 text-4 leading-5 text-pine-deep">
          {params.error}
        </p>
      ) : null}
      {user ? <AccountSection name={user.name} /> : null}
      {user && user.role !== null ? <AdminSection /> : null}
      {user ? null : <ProviderSection nextPath={nextPath} />}
    </section>
  );
};

/**
 * section
 */
const AccountSection = ({ name }: AccountSectionProps) => (
  <Panel
    label="로그인 상태"
    title={`${name} 님`}
    description="로그인되어 있습니다. 다른 계정으로 바꾸려면 로그아웃해 주세요.">
    <form action="/auth/logout" method="post">
      <Button
        variant="line"
        color="paper"
        type="submit"
        text="로그아웃"
        leftChildren={<Icon name="log-out" size={16} />}
        isRound
        isFullWidth
      />
    </form>
  </Panel>
);

const AdminSection = () => (
  <Panel
    label="운영자 전용"
    title="관리자 화면"
    description="소식·공지, 정관, 조직도와 회원 권한을 관리합니다.">
    <Button
      variant="solid"
      color="pine"
      text="관리자 화면으로 가기"
      href={ADMIN_URL}
      rightChildren={<Icon name="external-link" size={16} />}
      isRound
      isFullWidth
    />
  </Panel>
);

const ProviderSection = ({ nextPath }: ProviderSectionProps) => (
  <div className="flex flex-col gap-3">
    <Button
      variant="solid"
      color="kakao"
      text="카카오로 로그인"
      leftChildren={<KakaoLogo />}
      href={`/auth/kakao?next=${encodeURIComponent(nextPath)}`}
      isRound
      isFullWidth
    />
    <Button
      variant="line"
      color="paper"
      text="구글로 로그인"
      leftChildren={<GoogleLogo />}
      href={`/auth/google?next=${encodeURIComponent(nextPath)}`}
      isRound
      isFullWidth
    />
  </div>
);

/**
 * inner components
 */
const Panel = ({ label, title, description, children }: PanelProps) => (
  <div className="flex flex-col gap-5 rounded-3xlarge border border-beige bg-white p-6">
    <div>
      <BrandText variant="caption" color="goldDeep">
        {label}
      </BrandText>
      <p className="mt-1 text-6 leading-8 font-semibold text-pine">{title}</p>
      <BrandText variant="smallCompact" color="muted" className="mt-1">
        {description}
      </BrandText>
    </div>
    {children}
  </div>
);

const KakaoLogo = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 3.5c-5.25 0-9.5 3.3-9.5 7.36 0 2.62 1.76 4.92 4.41 6.22l-.9 3.3c-.08.3.26.54.52.37l3.94-2.6c.5.06 1 .1 1.53.1 5.25 0 9.5-3.3 9.5-7.4S17.25 3.5 12 3.5Z"
    />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.5 10.5 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
    />
  </svg>
);

export default LoginScreen;
