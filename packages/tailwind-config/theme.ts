/**
 * tokens.css 색을 JS에서 쓸 때의 CSS 변수 참조.
 * 클래스로 표현할 수 없을 때(`Text`·`Icon`의 color, SVG 채우기)만 쓴다.
 */
const scale = (name: string) => ({
  default: `var(--color-${name})`,
  50: `var(--color-${name}-50)`,
  100: `var(--color-${name}-100)`,
  200: `var(--color-${name}-200)`,
  300: `var(--color-${name}-300)`,
  400: `var(--color-${name}-400)`,
  500: `var(--color-${name}-500)`,
  600: `var(--color-${name}-600)`,
  700: `var(--color-${name}-700)`,
  800: `var(--color-${name}-800)`,
  900: `var(--color-${name}-900)`,
});

export const colors = {
  white: "var(--color-white)",
  black: "var(--color-black)",
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  gray: scale("gray"),
  primary: scale("primary"),
  green: scale("green"),
  orange: scale("orange"),
  red: scale("red"),
  brand: {
    pine: "var(--color-pine)",
    pineDeep: "var(--color-pine-deep)",
    sage: "var(--color-sage)",
    gold: "var(--color-gold)",
    goldDeep: "var(--color-gold-deep)",
    bark: "var(--color-bark)",
    beige: "var(--color-beige)",
    paper: "var(--color-paper)",
    ink: "var(--color-ink)",
    muted: "var(--color-muted)",
  },
} as const;
