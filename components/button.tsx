import type { ReactNode } from "react";
import Icon from "@components/icon";
import cn, { tv } from "@utils/cn";

/**
 * constants
 */
const button = tv({
  base: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent font-medium leading-none tracking-[-0.01em] transition duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold",
  variants: {
    variant: {
      solid: "border-bronze bg-bronze text-snow hover:bg-bronze-deep",
      gold: "border-gold bg-gold text-ink hover:bg-gold-soft",
      ghostLight: "border-ivory/70 bg-transparent text-ivory hover:bg-ivory/10",
      ghostDark: "border-ink/30 bg-transparent text-ink hover:bg-ink/5",
      ghostCream: "border-cream/55 bg-transparent text-cream hover:bg-cream/10",
    },
    size: {
      small: "min-h-10 px-4 text-3.5",
      medium: "min-h-12 px-5.5 text-4",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

/**
 * types
 */
export type Variant =
  "solid" | "gold" | "ghostLight" | "ghostDark" | "ghostCream";

export type Size = "small" | "medium";

type Props = {
  variant: Variant;
  size?: Size;
  text: string;
  href?: string;
  isExternal?: boolean;
  hasChevron?: boolean;
  className?: string;
  onClick?: () => void;
};

/**
 * 버튼
 * @param variant 형태
 * @param size 크기
 * @param text 문구
 * @param href 이동 주소. 없으면 동작하지 않는 버튼
 * @param isExternal 새 탭으로 열지
 * @param hasChevron 오른쪽 화살표
 * @param className 추가 클래스
 * @param onClick 클릭
 */
const Button = ({
  variant,
  size = "medium",
  text,
  href,
  isExternal = false,
  hasChevron = false,
  className,
  onClick,
}: Props) => {
  // variables
  const classNames = cn(button({ variant, size }), className);
  const content: ReactNode = (
    <>
      <span>{text}</span>
      {hasChevron ? <Icon name="chevron-right" size={16} /> : null}
    </>
  );
  // render
  if (href) {
    return (
      <a
        className={classNames}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <button className={classNames} type="button" onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
