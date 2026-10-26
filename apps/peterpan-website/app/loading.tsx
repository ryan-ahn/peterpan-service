import Spinner from "@repo/ui/components/spinner";

/**
 * screen — 페이지 이동 중 본문 자리에 바로 보이는 로딩 표시. 헤더·푸터는 그대로 둔다
 */
const LoadingScreen = () => {
  // render
  return (
    <div className="flex justify-center py-40 text-pine">
      <Spinner size="large" />
    </div>
  );
};

export default LoadingScreen;
