/**
 * 날짜를 서울 기준 `YYYY.MM.DD`로 적는다
 */
export const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find(part => part.type === "year")?.value ?? "";
  const month = parts.find(part => part.type === "month")?.value ?? "";
  const day = parts.find(part => part.type === "day")?.value ?? "";
  return `${year}.${month}.${day}`;
};

/**
 * 비어 있으면 "준비 중"
 */
export const displayOrPreparing = (value: string) => value.trim() || "준비 중";
