/**
 * constants
 */
const ICONS = {
  "alert-circle": { d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5v5m0 3.5h.01" },
  calendar: {
    d: "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm-1 5h16M8 3v4M16 3v4",
  },
  camera: {
    d: "M4 8a1 1 0 0 1 1-1h3l1.5-2h5L16 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Zm8 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
  },
  check: { d: "M5 12.5 10 17.5 19 7" },
  "check-circle": {
    d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-4 9.5 2.8 2.8L16.5 9.5",
  },
  "chevron-down": { d: "M5.5 9 12 15.5 18.5 9" },
  "chevron-left": { d: "M15 5.5 8.5 12 15 18.5" },
  "chevron-right": { d: "M9 5.5 15.5 12 9 18.5" },
  "chevron-up": { d: "M5.5 15 12 8.5 18.5 15" },
  close: { d: "M6 6l12 12M18 6 6 18" },
  edit: { d: "M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4" },
  "external-link": {
    d: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  },
  eye: {
    d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  },
  "file-text": {
    d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h6",
  },
  grip: {
    d: "M9 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9 16.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
    isFilled: true,
  },
  heart: {
    d: "M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.7C19 15.6 12 20 12 20Z",
    isFilled: true,
  },
  home: {
    d: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z",
  },
  image: {
    d: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm-1 12 5-5 4 4 2-2 5 5M15.5 8.5h.01",
  },
  info: { d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 8v5m0-8.5h.01" },
  instagram: {
    d: "M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5Zm8.2 2.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 8.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2Z",
    isFilled: true,
  },
  "log-out": {
    d: "M9 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4M16 16l4-4-4-4M20 12H10",
  },
  mail: { d: "M4 6.5h16v11H4v-11Zm0 0 8 6.2L20 6.5" },
  megaphone: {
    d: "M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1Zm13-1.5a5 5 0 0 1 0 7",
  },
  menu: { d: "M4 7h16M4 12h16M4 17h16" },
  minus: { d: "M5 12h14" },
  more: {
    d: "M5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
    isFilled: true,
  },
  pin: { d: "M9 4h6l-1 6 3 3v1H7v-1l3-3-1-6Zm3 10v6" },
  plus: { d: "M12 5v14M5 12h14" },
  search: { d: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4" },
  sitemap: {
    d: "M9.5 3.5h5v4h-5v-4ZM3.5 16.5h5v4h-5v-4Zm12 0h5v4h-5v-4ZM12 7.5V12M6 16.5V12h12v4.5",
  },
  star: {
    d: "M12 2.4 14.7 8.8 21.6 9.4 16.4 14l1.6 6.8L12 17.6 6 20.8 7.6 14 2.4 9.4 9.3 8.8 12 2.4Z",
    isFilled: true,
  },
  trash: { d: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" },
  user: { d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" },
  users: {
    d: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.2a6 6 0 0 1 3 5.8",
  },
  youtube: {
    d: "M4.2 7.4A2.6 2.6 0 0 1 6.7 5.2c1.8-.2 3.7-.3 5.3-.3s3.5.1 5.3.3a2.6 2.6 0 0 1 2.5 2.2c.2 1.2.3 2.5.3 4.6s-.1 3.4-.3 4.6a2.6 2.6 0 0 1-2.5 2.2c-1.8.2-3.7.3-5.3.3s-3.5-.1-5.3-.3a2.6 2.6 0 0 1-2.5-2.2C4 15.4 3.9 14.1 3.9 12s.1-3.4.3-4.6ZM10.4 9.2v5.6l4.8-2.8-4.8-2.8Z",
    isFilled: true,
  },
} satisfies Record<string, { d: string; isFilled?: boolean }>;

/**
 * types
 */
export type Name = keyof typeof ICONS;

type Props = {
  name: Name;
  size?: number;
  color?: string;
  label?: string;
  className?: string;
};

/**
 * 아이콘. 24 격자 SVG 한 장
 * @param name 아이콘 이름
 * @param size 한 변 길이(px)
 * @param color 선·면 색. 기본은 글자색(`currentColor`)
 * @param label 스크린 리더 이름. 없으면 장식으로 숨긴다
 * @param className 추가 클래스
 */
const Icon = ({
  name,
  size = 20,
  color = "currentColor",
  label,
  className,
}: Props) => {
  // variables
  const icon: { d: string; isFilled?: boolean } = ICONS[name];
  const isFilled = icon.isFilled === true;
  // render
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill={isFilled ? color : "none"}
      stroke={isFilled ? "none" : color}
      strokeWidth={isFilled ? 0 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d={icon.d} />
    </svg>
  );
};

export default Icon;
