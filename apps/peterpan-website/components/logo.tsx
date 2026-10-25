import Image from "next/image";
import Link from "next/link";

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
    <Link
      href="/"
      className="inline-flex shrink-0 items-center"
      aria-label="홈">
      {variant === "symbol" ? (
        <Image
          src="/brand/logo-symbol.png"
          alt=""
          width={44}
          height={44}
          className="size-11 rounded-xlarge"
        />
      ) : (
        <Image
          src="/brand/logo-horizontal.png"
          alt="피터팬 재단"
          width={168}
          height={138}
          priority
          className="h-16 w-auto"
        />
      )}
    </Link>
  );
};

export default Logo;
