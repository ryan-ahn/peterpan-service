import type { Metadata } from "next";

export const metadata: Metadata = { title: "개인정보처리방침" };

const PrivacyPage = () => (
  <article className="mx-auto flex w-[min(820px,calc(100%-2rem))] flex-col gap-6 py-16 leading-8">
    <h1 className="text-4xl font-semibold text-green">개인정보처리방침</h1>
    <p>
      재단법인 피터팬 자폐인복지재단 설립추진위원회(이하 재단)는 홈페이지
      이용자의 개인정보를 소관 목적 안에서만 처리합니다. 등기가 끝나면 처리
      주체를 법인 명의로 갱신합니다.
    </p>
    <h2 className="text-2xl font-semibold text-green">수집 항목과 목적</h2>
    <ul className="list-disc pl-5">
      <li>카카오 또는 구글 로그인: 식별자, 이메일, 이름, 프로필 이미지. 회원 식별과 관리자 권한 확인.</li>
      <li>후원 참여: 이름, 이메일, 전화번호, 참여 방법, 희망 금액, 메시지. 후원 안내.</li>
      <li>게시 파일과 글: 관리자가 올린 공시·소식. 공개 목적.</li>
    </ul>
    <h2 className="text-2xl font-semibold text-green">보유 기간</h2>
    <p>
      로그인 정보는 탈퇴 또는 권한 삭제 시까지, 후원 참여 정보는 안내 완료 후
      1년 또는 관계 법령이 정한 기간까지 보관합니다. 기부금 영수증과 회계 자료는
      관련 법령의 보존 기간을 따릅니다.
    </p>
    <h2 className="text-2xl font-semibold text-green">제3자 제공과 처리 위탁</h2>
    <p>
      로그인은 카카오, 구글, Supabase를 통해 처리됩니다. 재단은 판매나 광고를
      위해 개인정보를 넘기지 않습니다. 법령에 따른 요청이 있으면 제공할 수
      있습니다.
    </p>
    <h2 className="text-2xl font-semibold text-green">권리</h2>
    <p>
      이용자는 자신의 정보에 대해 열람, 정정, 삭제, 처리 정지를 요청할 수
      있습니다. 연락처는 하단의 이메일이 확정되는 대로 안내하며, 그 전에는
      로그인한 관리자에게 요청할 수 있습니다.
    </p>
    <p className="text-sm text-muted">시행 2026년 10월 23일</p>
  </article>
);

export default PrivacyPage;
