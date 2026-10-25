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
      { label: "재단 정보", href: "/about/organization" },
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
  { label: "소식", href: "/news" },
  {
    label: "정보공개",
    href: "/disclosure",
    children: [
      { label: "경영공시", href: "/disclosure/management" },
      { label: "기부금 공시", href: "/disclosure/donations" },
    ],
  },
  { label: "기부하기", href: "/donate" },
];

export const FOOTER_LINKS = [
  { label: "설립 배경", href: "/about" },
  { label: "피터팬마을", href: "/village" },
  { label: "재단소식", href: "/news" },
  { label: "경영공시", href: "/disclosure/management" },
  { label: "기부금 공시", href: "/disclosure/donations" },
  { label: "개인정보처리방침", href: "/privacy" },
];
