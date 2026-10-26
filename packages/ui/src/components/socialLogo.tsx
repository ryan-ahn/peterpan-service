import cn from "../lib/cn";

/**
 * types
 */
type Provider = "kakao" | "google";

type Props = {
  provider: Provider;
  className?: string;
};

/**
 * 소셜 로그인 브랜드 로고. 카카오는 글자색을 따르고, 구글은 브랜드 색을 그대로 쓴다
 * @param provider kakao / google
 * @param className 크기 (기본 size-5)
 */
const SocialLogo = ({ provider, className }: Props) => {
  // render
  if (provider === "kakao") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={cn("size-5 shrink-0", className)}
        aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3.5c-5.25 0-9.5 3.3-9.5 7.36 0 2.62 1.76 4.92 4.41 6.22l-.9 3.3c-.08.3.26.54.52.37l3.94-2.6c.5.06 1 .1 1.53.1 5.25 0 9.5-3.3 9.5-7.4S17.25 3.5 12 3.5Z"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      aria-hidden="true">
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
};

export default SocialLogo;
