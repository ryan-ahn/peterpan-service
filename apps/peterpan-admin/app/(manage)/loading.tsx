import Spinner from "@repo/ui/components/spinner";

/**
 * screen — 관리 화면 이동 중 본문 자리에 바로 보이는 로딩 표시. 메뉴·헤더는 그대로 둔다
 */
const LoadingScreen = () => {
  // render
  return (
    <div className="flex justify-center py-24 text-gray-400">
      <Spinner size="large" />
    </div>
  );
};

export default LoadingScreen;
