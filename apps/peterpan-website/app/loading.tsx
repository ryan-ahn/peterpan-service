import Spinner from "@repo/ui/components/spinner";

/**
 * screen — 페이지 이동 중 본문 자리에 바로 보이는 로딩 표시. 헤더·푸터는 그대로 둔다.
 * 화면 높이만큼 차지해 본문이 들어올 때 푸터가 화면 안에서 밀려나지 않게 한다 (CLS)
 */
const LoadingScreen = () => {
  // render
  return (
    <div className="flex min-h-dvh justify-center py-40 text-pine">
      <Spinner size="large" />
    </div>
  );
};

export default LoadingScreen;
