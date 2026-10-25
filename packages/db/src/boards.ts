/**
 * 게시판·분류·후원 종류 라벨. 클라이언트에서도 import 한다 (DB 연결 없음).
 */

/**
 * constants
 */
export const BOARDS = [
  { id: "news", label: "재단소식" },
  { id: "management", label: "경영공시" },
  { id: "donation", label: "기부금 공시" },
] as const;

export const NEWS_CATEGORIES = [
  { id: "notice", label: "공지" },
  { id: "activity", label: "활동" },
  { id: "press", label: "언론보도" },
] as const;

export const DONATION_KINDS = [
  { id: "founding", label: "창립발기" },
  { id: "monthly", label: "정기 후원" },
  { id: "once", label: "일시 후원" },
] as const;

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

export const isDonationKindId = (value: string): value is DonationKindId =>
  DONATION_KINDS.some(kind => kind.id === value);

export const boardLabel = (board: string) =>
  BOARDS.find(item => item.id === board)?.label ?? board;

export const categoryLabel = (category: string | null) =>
  NEWS_CATEGORIES.find(item => item.id === category)?.label ?? "소식";

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
