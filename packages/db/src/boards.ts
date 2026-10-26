/**
 * 게시판·분류·후원 종류 라벨, 회원 입력 한도. 클라이언트에서도 import 한다 (DB 연결 없음).
 */

/**
 * constants
 */
export const BOARDS = [
  { id: "news", label: "재단 소식" },
  { id: "management", label: "경영 공시" },
  { id: "donation", label: "기부금 공시" },
] as const;

export const NEWS_CATEGORIES = [
  { id: "notice", label: "공지" },
  { id: "activity", label: "활동" },
  { id: "press", label: "언론보도" },
] as const;

export const BOARD_POST_LIMIT = {
  title: 100,
  body: 10000,
  comment: 1000,
} as const;

export const PROFILE_LIMIT = {
  name: 20,
} as const;

export const AVATAR_UPLOAD = {
  bucket: "avatars",
  maxSize: 2 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;

export const DONATION_KINDS = [
  { id: "once", label: "일시 후원" },
  { id: "monthly", label: "정기 후원" },
  { id: "pledge", label: "약정 이행" },
  { id: "founding", label: "창립발기 (이전 방식)" },
] as const;

/**
 * 후원 알림 양식에서 고를 수 있는 방식. 정기 후원은 재단 설립·PG 심사 뒤 결제 연동과 함께 연다.
 * 나머지는 지난 기록 표시에만 쓴다
 */
export const DONATION_FORM_KINDS = DONATION_KINDS.filter(
  kind => kind.id === "once",
);

/**
 * types
 */
export type BoardId = (typeof BOARDS)[number]["id"];

export type NewsCategoryId = (typeof NEWS_CATEGORIES)[number]["id"];

export type DonationKindId = (typeof DONATION_KINDS)[number]["id"];

/**
 * utils
 */
export const isBoardId = (value: string): value is BoardId =>
  BOARDS.some(board => board.id === value);

export const isNewsCategoryId = (value: string): value is NewsCategoryId =>
  NEWS_CATEGORIES.some(category => category.id === value);

export const isDonationFormKind = (value: string): value is DonationKindId =>
  DONATION_FORM_KINDS.some(kind => kind.id === value);

export const boardLabel = (board: string) =>
  BOARDS.find(item => item.id === board)?.label ?? board;

export const categoryLabel = (category: string | null) =>
  NEWS_CATEGORIES.find(item => item.id === category)?.label ?? "소식";

export const isAvatarType = (
  value: string,
): value is (typeof AVATAR_UPLOAD.types)[number] =>
  AVATAR_UPLOAD.types.some(type => type === value);

export const donationKindLabel = (kind: string) =>
  DONATION_KINDS.find(item => item.id === kind)?.label ?? kind;

export const publicStorageUrl = (params: { bucket: string; path: string }) => {
  const { bucket, path } = params;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) {
    return "";
  }
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
};
