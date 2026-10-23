import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "horizontal" | "symbol";
  className?: string;
};

const Logo = ({ variant = "horizontal", className }: LogoProps) => {
  if (variant === "symbol") {
    return (
      <Image
        src="/brand/logo-symbol.png"
        alt=""
        width={44}
        height={44}
        className={className ?? "size-11 rounded-2xl"}
      />
    );
  }
  return (
    <Image
      src="/brand/logo-horizontal.png"
      alt="피터팬 재단"
      width={168}
      height={138}
      priority
      className={className ?? "h-16 w-auto"}
    />
  );
};

export const LogoLink = ({
  variant = "horizontal",
}: {
  variant?: LogoProps["variant"];
}) => (
  <Link href="/" className="inline-flex shrink-0 items-center" aria-label="홈">
    <Logo variant={variant} />
  </Link>
);

export default Logo;
