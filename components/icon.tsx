export type Name =
  | "star"
  | "chevron-right"
  | "chevron-down"
  | "menu"
  | "close"
  | "instagram"
  | "youtube"
  | "mail";

type Props = {
  name: Name;
  size?: number;
  color?: string;
};

const paths: Record<Name, string> = {
  star: "M12 2.4 14.7 8.8 21.6 9.4 16.4 14l1.6 6.8L12 17.6 6 20.8 7.6 14 2.4 9.4 9.3 8.8 12 2.4Z",
  "chevron-right": "M9 5.5 15.5 12 9 18.5",
  "chevron-down": "M5.5 9 12 15.5 18.5 9",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  instagram:
    "M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5Zm8.2 2.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 8.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2Z",
  youtube:
    "M4.2 7.4A2.6 2.6 0 0 1 6.7 5.2c1.8-.2 3.7-.3 5.3-.3s3.5.1 5.3.3a2.6 2.6 0 0 1 2.5 2.2c.2 1.2.3 2.5.3 4.6s-.1 3.4-.3 4.6a2.6 2.6 0 0 1-2.5 2.2c-1.8.2-3.7.3-5.3.3s-3.5-.1-5.3-.3a2.6 2.6 0 0 1-2.5-2.2C4 15.4 3.9 14.1 3.9 12s.1-3.4.3-4.6ZM10.4 9.2v5.6l4.8-2.8-4.8-2.8Z",
  mail: "M4 6.5h16v11H4v-11Zm0 0 8 6.2L20 6.5",
};

/**
 * 아이콘
 * @param name 아이콘 이름
 * @param size 한 변 길이
 * @param color 선·면 색
 */
const Icon = ({ name, size = 18, color = "currentColor" }: Props) => {
  // variables
  const isFilled =
    name === "star" || name === "instagram" || name === "youtube";
  // render
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={isFilled ? color : "none"}
      stroke={isFilled ? "none" : color}
      strokeWidth={isFilled ? 0 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
};

export default Icon;
