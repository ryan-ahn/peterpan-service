import BrandSkeleton from "@components/brandSkeleton";

/**
 * types
 */
type Props = {
  rows?: number;
};

/**
 * 소식·게시판 목록 표 자리를 잡는 스켈레톤
 * @param rows 줄 수
 */
const RowListSkeleton = ({ rows = 6 }: Props) => {
  // render
  return (
    <div className="mt-8 overflow-hidden rounded-2xlarge border border-beige bg-white">
      <div className="hidden border-b border-beige px-6 py-3 md:block">
        <BrandSkeleton className="h-5 w-48" />
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 border-b border-beige px-6 py-4 last:border-b-0 md:flex-row md:items-center md:gap-6">
          <BrandSkeleton className="hidden h-5 w-10 md:block" />
          <BrandSkeleton className="h-5 w-3/4 md:flex-1" />
          <BrandSkeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
};

export default RowListSkeleton;
