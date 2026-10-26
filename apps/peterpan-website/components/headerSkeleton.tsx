import BrandSkeleton from "@components/brandSkeleton";

/**
 * `FoundationHeader` 자리를 잡는 스켈레톤 (영문 분류·제목·금색 선·요약)
 */
const HeaderSkeleton = () => {
  // render
  return (
    <div className="border-b border-beige">
      <div className="page-article py-12 lg:py-14">
        <BrandSkeleton className="h-4 w-28" />
        <BrandSkeleton className="mt-4 h-10 w-48 lg:h-12" />
        <div className="mt-5 w-10 border-t-2 border-gold" />
        <BrandSkeleton className="mt-5 h-5 w-full max-w-xl" />
        <BrandSkeleton className="mt-2 h-5 w-2/3 max-w-md" />
      </div>
    </div>
  );
};

export default HeaderSkeleton;
