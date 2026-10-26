import BrandSkeleton from "@components/brandSkeleton";

/**
 * screen — 글쓰기 스켈레톤. 머리, 제목·내용 입력 칸, 올리기 버튼
 */
const BoardWriteLoadingScreen = () => {
  // render
  return (
    <div className="page-article min-h-dvh py-10 lg:py-12">
      <BrandSkeleton className="h-5 w-16" />
      <BrandSkeleton className="mt-6 h-4 w-12" />
      <BrandSkeleton className="mt-3 h-10 w-32" />
      <BrandSkeleton className="mt-4 h-5 w-56" />
      <div className="mt-8 flex flex-col gap-5 rounded-2xlarge border border-beige bg-white px-5 py-6 md:px-8 md:py-8">
        <BrandSkeleton className="h-5 w-10" />
        <BrandSkeleton className="h-12 w-full rounded-large" />
        <BrandSkeleton className="h-5 w-10" />
        <BrandSkeleton className="h-80 w-full rounded-large" />
        <BrandSkeleton isRound className="h-12 w-28 self-end" />
      </div>
    </div>
  );
};

export default BoardWriteLoadingScreen;
