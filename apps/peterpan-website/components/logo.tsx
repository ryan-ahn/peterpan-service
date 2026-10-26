import Image from "next/image";

import HoverPrefetchLink from "@components/hoverPrefetchLink";

/**
 * types
 */
type Variant = "horizontal" | "symbol";

type Props = {
  variant?: Variant;
};

/**
 * 홈으로 가는 로고. horizontal 헤더 / symbol 푸터
 * @param variant 로고 모양
 */
const Logo = ({ variant = "horizontal" }: Props) => {
  // render
  return (
    <HoverPrefetchLink
      href="/"
      className="inline-flex shrink-0 items-center gap-2.5"
      aria-label="피터팬 재단 홈">
      <Image
        src="/brand/logo-symbol.png"
        alt=""
        width={313}
        height={354}
        priority={variant === "horizontal"}
        className={variant === "symbol" ? "h-11 w-auto" : "h-12 w-auto"}
      />
      {variant === "horizontal" ? (
        <span className="flex flex-col">
          <span className="text-4.5 leading-5 font-bold tracking-tight text-pine md:text-5 md:leading-6">
            피터팬 재단
          </span>
          <span className="hidden font-en text-2 leading-3 font-medium tracking-caps text-pine md:block">
            PETER PAN FOUNDATION
          </span>
        </span>
      ) : null}
    </HoverPrefetchLink>
  );
};

export default Logo;
