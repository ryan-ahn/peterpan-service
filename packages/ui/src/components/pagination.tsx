import Icon from "../icon";
import cn from "../lib/cn";

/**
 * constants
 */
const ARROW_CLASS_NAME =
  "grid size-9 cursor-pointer place-items-center rounded-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

/**
 * types
 */
type Props = {
  page: number;
  pageCount: number;
  siblingCount?: number;
  className?: string;
  onChange: (page: number) => void;
};

/**
 * pre-root utils
 */
type ReadPageWindowParams = {
  page: number;
  pageCount: number;
  siblingCount: number;
};

const readPageWindow = (params: ReadPageWindowParams): number[] => {
  const { page, pageCount, siblingCount } = params;
  const size = Math.min(pageCount, siblingCount * 2 + 1);
  const start = Math.min(
    Math.max(1, page - siblingCount),
    Math.max(1, pageCount - size + 1),
  );
  return Array.from({ length: size }, (_, index) => start + index);
};

/**
 * 쪽 번호. 현재 쪽 양옆으로 `siblingCount`개씩 보인다
 * @param page 현재 쪽(1부터)
 * @param pageCount 전체 쪽 수
 * @param siblingCount 현재 쪽 양옆에 보일 번호 수
 * @param className 추가 클래스
 * @param onChange 쪽 변경
 */
const Pagination = ({
  page,
  pageCount,
  siblingCount = 2,
  className,
  onChange,
}: Props) => {
  // variables
  const pages = readPageWindow({ page, pageCount, siblingCount });
  // render
  if (pageCount <= 1) {
    return null;
  }
  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="쪽 이동">
      <button
        className={ARROW_CLASS_NAME}
        type="button"
        aria-label="이전 쪽"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}>
        <Icon name="chevron-left" size={18} />
      </button>
      {pages.map(number => (
        <button
          key={number}
          className={cn(
            "h-9 min-w-9 cursor-pointer rounded-medium px-2 text-3.5 leading-5 font-medium transition-colors duration-150",
            number === page
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100",
          )}
          type="button"
          aria-current={number === page ? "page" : undefined}
          onClick={() => onChange(number)}>
          {number}
        </button>
      ))}
      <button
        className={ARROW_CLASS_NAME}
        type="button"
        aria-label="다음 쪽"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}>
        <Icon name="chevron-right" size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
