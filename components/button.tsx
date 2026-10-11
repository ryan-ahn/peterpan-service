import type { ReactNode } from "react";

import Icon from "@components/icon";

import styles from "./button.module.css";

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
 * @param onClick 클릭
 */
const Button = ({
  variant,
  size = "medium",
  text,
  href,
  isExternal = false,
  hasChevron = false,
  onClick,
}: Props) => {
  // variables
  const className = `${styles.button} ${styles[variant]} ${styles[size]}`;
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
        className={className}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <button className={className} type="button" onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
