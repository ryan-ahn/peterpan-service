import BrandSkeleton from "@components/brandSkeleton";

/**
 * screen — 마이페이지 스켈레톤. 머리, 프로필 카드, 탭, 탭 본문
 */
const MyPageLoadingScreen = () => {
  // render
  return (
    <div className="page-article flex min-h-dvh flex-col gap-8 py-12">
      <div>
        <BrandSkeleton className="h-4 w-14" />
        <BrandSkeleton className="mt-3 h-10 w-40" />
      </div>
      <div className="flex flex-col items-center gap-6 rounded-3xlarge border border-beige bg-white p-6 md:flex-row md:p-8">
        <BrandSkeleton isRound className="size-24 shrink-0" />
        <div className="flex w-full flex-1 flex-col items-center gap-2 md:items-start">
          <BrandSkeleton className="h-8 w-32" />
          <BrandSkeleton className="h-5 w-48" />
          <BrandSkeleton className="h-4 w-40" />
        </div>
      </div>
      <BrandSkeleton isRound className="h-12 w-full" />
      <BrandSkeleton className="h-72 w-full rounded-2xlarge" />
    </div>
  );
};

export default MyPageLoadingScreen;
