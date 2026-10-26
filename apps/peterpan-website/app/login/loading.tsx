import PageIntro from "@components/pageIntro";
import SocialLoginButtons from "@components/socialLoginButtons";

/**
 * screen — 로그인 로딩. 세션을 읽는 동안 같은 화면을 누를 수 없게 먼저 보인다
 */
const LoginLoadingScreen = () => {
  // render
  return (
    <section className="page-auth flex flex-col gap-6 py-20">
      <PageIntro title="로그인" lead="원하시는 로그인 방법을 선택해 주세요." />
      <div inert>
        <SocialLoginButtons nextPath="/" />
      </div>
    </section>
  );
};

export default LoginLoadingScreen;
