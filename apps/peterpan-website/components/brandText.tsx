import type { ElementType, ReactNode } from "react";

import cn from "@repo/ui/lib/cn";
import tv from "@repo/ui/lib/tv";
import Text, { type Variant as TextVariant } from "@repo/ui/text";

/**
 * constants
 */
const BASE_VARIANT: Record<Variant, TextVariant> = {
  display: "display-1",
  title: "display-2",
  section: "heading-1",
  heading: "heading-2",
  cardTitle: "heading-5",
  lead: "body-1",
  body: "body-1",
  bodyCompact: "body-1",
  small: "body-3",
  smallCompact: "body-3",
  caption: "caption-1",
  overline: "label-5",
  pen: "heading-1",
};

const brandText = tv({
  variants: {
    variant: {
      display:
        "text-18 leading-20 font-semibold tracking-tight md:text-27 md:leading-31",
      title: "text-15 leading-15 font-semibold tracking-normal",
      section:
        "text-12 leading-13 font-semibold tracking-normal md:text-15 md:leading-15",
      heading: "text-9 leading-11 font-semibold tracking-normal",
      cardTitle: "text-6 leading-9 font-semibold tracking-normal",
      lead: "text-6 leading-11 font-normal",
      body: "text-5 leading-11 font-normal",
      bodyCompact: "text-5 leading-9 font-normal",
      small: "text-4 leading-9 font-normal",
      smallCompact: "text-4 leading-7 font-normal",
      caption: "text-4 leading-5 font-normal",
      overline:
        "font-en text-3 leading-4 font-semibold tracking-caps-wide uppercase",
      pen: "font-pen text-11 leading-14 font-normal tracking-normal md:text-12 md:leading-16",
    },
    color: {
      inherit: "",
      ink: "text-ink",
      inkSoft: "text-ink/90",
      muted: "text-muted",
      pine: "text-pine",
      pineDeep: "text-pine-deep",
      gold: "text-gold",
      goldDeep: "text-gold-deep",
      sage: "text-sage",
      beige: "text-beige",
      paper: "text-paper",
      white: "text-white",
      whiteSoft: "text-white/85",
    },
  },
});

/**
 * types
 */
export type Variant =
  | "display"
  | "title"
  | "section"
  | "heading"
  | "cardTitle"
  | "lead"
  | "body"
  | "bodyCompact"
  | "small"
  | "smallCompact"
  | "caption"
  | "overline"
  | "pen";

export type Color =
  | "inherit"
  | "ink"
  | "inkSoft"
  | "muted"
  | "pine"
  | "pineDeep"
  | "gold"
  | "goldDeep"
  | "sage"
  | "beige"
  | "paper"
  | "white"
  | "whiteSoft";

type Props = {
  as?: ElementType;
  variant: Variant;
  color?: Color;
  className?: string;
  children: ReactNode;
};

/**
 * 웹사이트 글자. `@repo/ui` Text 위에 새 디자인의 크기·줄간격·브랜드 색을 얹는다
 * @param as 렌더할 태그
 * @param variant 브랜드 타이포그래피. display 홈 제목 / title 페이지 제목 / section 섹션 제목 / heading 소제목 / cardTitle 카드 제목 / lead·body·small 본문 / caption 보조 / overline 영문 라벨 / pen 손글씨
 * @param color 브랜드 색. 없으면 부모 색을 따른다
 * @param className 추가 클래스
 * @param children 내용
 */
const BrandText = ({
  as = "p",
  variant,
  color = "inherit",
  className,
  children,
}: Props) => {
  // render
  return (
    <Text
      as={as}
      variant={BASE_VARIANT[variant]}
      className={cn(brandText({ variant, color }), className)}>
      {children}
    </Text>
  );
};

export default BrandText;
