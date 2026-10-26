export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV: NavItem[] = [
  {
    label: "재단소개",
    href: "/about",
    children: [
      { label: "설립 배경과 목적", href: "/about" },
      { label: "대표 인사말", href: "/about/greeting" },
      { label: "상징과 미션", href: "/about/brand" },
      { label: "조직도", href: "/about/organization" },
      { label: "정관", href: "/about/bylaws" },
    ],
  },
  {
    label: "마을소개",
    href: "/village",
    children: [
      { label: "마을 소개", href: "/village" },
      { label: "조감과 공간", href: "/village/spaces" },
      { label: "운영 방향", href: "/village/operation" },
    ],
  },
  {
    label: "소통",
    href: "/news",
    children: [
      { label: "소식", href: "/news" },
      { label: "게시판", href: "/board" },
    ],
  },
  {
    label: "정보공개",
    href: "/disclosure",
    children: [
      { label: "경영 공시", href: "/disclosure/management" },
      { label: "기부금 공시", href: "/disclosure/donations" },
    ],
  },
];
