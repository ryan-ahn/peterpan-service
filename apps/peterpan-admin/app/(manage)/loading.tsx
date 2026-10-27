import AdminRouteSkeleton from "@components/adminRouteSkeleton";

/**
 * screen — 관리 화면 이동 중 본문 자리 표시. 메뉴·헤더는 그대로 두고 목록형 스켈레톤을 쓴다
 */
const LoadingScreen = () => {
  // render
  return <AdminRouteSkeleton />;
};

export default LoadingScreen;
