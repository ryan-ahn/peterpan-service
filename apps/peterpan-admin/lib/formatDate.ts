/**
 * constants
 */
const adminDate = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const adminDateTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * types
 */
type FormatAdminDateParams = {
  value: string | null;
  hasTime?: boolean;
};

/**
 * 어드민 표 날짜. 비어 있거나 잘못된 값은 `—`
 */
export const formatAdminDate = (params: FormatAdminDateParams): string => {
  const { value, hasTime = false } = params;
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return hasTime ? adminDateTime.format(date) : adminDate.format(date);
};
