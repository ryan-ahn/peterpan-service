/**
 * constants
 */
const PAGE_COUNT = 3;

/**
 * 소식·게시판 목록 아래 쪽 번호 줄과 같은 크기의 스켈레톤
 */
const PagerSkeleton = () => {
  // render
  return (
    <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
      {Array.from({ length: PAGE_COUNT }, (_, index) => (
        <span
          key={index}
          className="size-9 animate-pulse rounded-full border border-transparent bg-beige"
        />
      ))}
    </div>
  );
};

export default PagerSkeleton;
