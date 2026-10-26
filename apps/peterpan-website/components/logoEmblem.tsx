import type { CREED_PRINCIPLES } from "@lib/foundation";

/**
 * types
 */
type Props = {
  name: (typeof CREED_PRINCIPLES)[number]["name"];
  className?: string;
};

/**
 * 로고를 이루는 네 모양(사람·곡선·오름·별)의 선 아이콘
 * @param name 모양 이름
 * @param className 크기·색
 */
const LogoEmblem = ({ name, className = "size-7" }: Props) => {
  // render
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round">
      {name === "people" ? (
        <>
          <circle cx="8" cy="7" r="2.2" />
          <path d="M3.2 18.5c.8-3.6 2.6-5.2 4.8-5.2s4 1.6 4.8 5.2" />
          <circle cx="16" cy="7.6" r="1.9" />
          <path d="M12.4 18.5c.6-3 2.1-4.4 3.7-4.4 1.6 0 2.8 1.2 3.5 3.6" />
        </>
      ) : null}
      {name === "curve" ? (
        <>
          <path d="M4 16c3.5-7 7-8 8-2s2.5 7 8 1" />
          <path d="M6.5 18.5c3-5.5 5.5-6 6.5-1.5" />
        </>
      ) : null}
      {name === "rise" ? (
        <>
          <path d="M5 17c2.2-.6 3.4-3.2 4.6-5.6C11 8.6 12.2 6.4 16 4.5" />
          <path d="M12.2 4.2H16.8V8.6" />
        </>
      ) : null}
      {name === "star" ? (
        <path d="M12 3.2 13.6 9.1 19.6 10.5 13.6 11.9 12 17.8 10.4 11.9 4.4 10.5 10.4 9.1Z" />
      ) : null}
    </svg>
  );
};

export default LogoEmblem;
