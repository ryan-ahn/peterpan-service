import BrandSkeleton from "@components/brandSkeleton";

/**
 * constants
 */
const VALUE_COUNT = 4;

/**
 * screen — 홈 스켈레톤. 첫 화면(소개 글·조감도)과 가치 카드 자리를 홈과 같은 `page-wide` 폭으로 잡는다.
 * 다른 화면은 각자 `loading.tsx`가 있다
 */
const HomeLoadingScreen = () => {
  // render
  return (
    <div className="min-h-dvh">
      <div className="border-b border-beige">
        <div className="page-wide grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:py-20">
          <div>
            <BrandSkeleton className="h-4 w-40" />
            <div className="mt-4 w-10 border-t-2 border-gold" />
            <div className="mt-5 flex flex-col gap-3">
              <BrandSkeleton className="h-9 w-4/5 lg:h-11" />
              <BrandSkeleton className="h-9 w-11/12 lg:h-11" />
              <BrandSkeleton className="h-9 w-3/4 lg:h-11" />
            </div>
            <div className="mt-6 flex max-w-md flex-col gap-2">
              <BrandSkeleton className="h-5 w-full" />
              <BrandSkeleton className="h-5 w-full" />
              <BrandSkeleton className="h-5 w-2/3" />
            </div>
            <div className="mt-8 flex gap-3">
              <BrandSkeleton className="h-12 w-28 rounded-full" />
              <BrandSkeleton className="h-12 w-28 rounded-full" />
            </div>
          </div>
          <div className="lg:pt-12">
            <BrandSkeleton className="aspect-2/1 w-full rounded-xlarge" />
          </div>
        </div>
      </div>
      <div className="bg-paper">
        <div className="page-wide py-16 lg:py-20">
          <BrandSkeleton className="h-4 w-36" />
          <BrandSkeleton className="mt-3 h-8 w-48" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: VALUE_COUNT }, (_, index) => (
              <BrandSkeleton key={index} className="h-40 rounded-xlarge" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoadingScreen;
