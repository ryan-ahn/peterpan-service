"use client";

import { useEffect, useState } from "react";

import Button from "@repo/ui/components/button";
import SocialLogo from "@repo/ui/components/socialLogo";

/**
 * constants
 */
const PROVIDERS = [
  {
    provider: "kakao",
    text: "카카오로 로그인",
    variant: "solid",
    color: "kakao",
  },
  {
    provider: "google",
    text: "구글로 로그인",
    variant: "line",
    color: "paper",
  },
] as const;

/**
 * types
 */
type Provider = (typeof PROVIDERS)[number]["provider"];

type Props = {
  nextPath: string;
};

/**
 * 카카오·구글 로그인 버튼. 하나를 누르면 모두 막고 누른 버튼에 스피너를 보인다
 * @param nextPath 로그인 뒤 돌아갈 곳
 */
const SocialLoginButtons = ({ nextPath }: Props) => {
  // states
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);
  // handlers
  const handleLoginStart = (provider: Provider) => {
    setPendingProvider(provider);
  };
  // effects
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setPendingProvider(null);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);
  // render
  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map(item => (
        <form
          key={item.provider}
          action={`/auth/${item.provider}`}
          method="get"
          onSubmit={() => handleLoginStart(item.provider)}>
          <input type="hidden" name="next" value={nextPath} />
          <Button
            variant={item.variant}
            color={item.color}
            type="submit"
            text={item.text}
            leftChildren={<SocialLogo provider={item.provider} />}
            isRound
            isFullWidth
            isDisabled={pendingProvider !== null}
            isLoading={pendingProvider === item.provider}
          />
        </form>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
