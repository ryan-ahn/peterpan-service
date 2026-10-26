import BrandSkeleton from "@components/brandSkeleton";

/**
 * screen — 로그인 스켈레톤. 제목·안내, 소셜 로그인 버튼 두 개
 */
const LoginLoadingScreen = () => {
  // render
  return (
    <div className="page-auth flex min-h-dvh flex-col gap-6 py-20">
      <div>
        <BrandSkeleton className="h-10 w-28" />
        <BrandSkeleton className="mt-4 h-5 w-64" />
      </div>
      <div className="flex flex-col gap-3">
        <BrandSkeleton isRound className="h-14 w-full" />
        <BrandSkeleton isRound className="h-14 w-full" />
      </div>
    </div>
  );
};

export default LoginLoadingScreen;
