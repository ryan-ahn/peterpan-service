import type { ElementType, ReactNode } from "react";

import styles from "./text.module.css";

export type Variant =
  "display" | "title" | "heading" | "body" | "caption" | "label" | "quote";

export type Color =
  | "ink"
  | "soft"
  | "cream"
  | "creamSoft"
  | "gold"
  | "goldLight"
  | "white"
  | "whiteSoft";

type Props = {
  as?: ElementType;
  variant: Variant;
  color?: Color;
  children: ReactNode;
};

const variantClassName: Record<Variant, string> = {
  display: styles.display,
  title: styles.title,
  heading: styles.heading,
  body: styles.body,
  caption: styles.caption,
  label: styles.label,
  quote: styles.quote,
};

const colorClassName: Record<Color, string> = {
  ink: styles.ink,
  soft: styles.soft,
  cream: styles.cream,
  creamSoft: styles.creamSoft,
  gold: styles.gold,
  goldLight: styles.goldLight,
  white: styles.white,
  whiteSoft: styles.whiteSoft,
};

/**
 * 텍스트
 * @param as 렌더할 태그
 * @param variant 타이포그래피
 * @param color 색
 * @param children 내용
 */
const Text = ({ as = "p", variant, color = "ink", children }: Props) => {
  // variables
  const Tag = as;
  // render
  return (
    <Tag
      className={`${styles.text} ${variantClassName[variant]} ${colorClassName[color]}`}>
      {children}
    </Tag>
  );
};

export default Text;
