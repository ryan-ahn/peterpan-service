import Link from "next/link";

const ForbiddenPage = () => (
  <section className="mx-auto flex w-[min(640px,calc(100%-2rem))] flex-col gap-4 py-20">
    <h1 className="text-3xl font-semibold text-green">관리 권한이 없습니다</h1>
    <p className="leading-7 text-muted">
      앱 환경변수의 ADMIN_EMAILS에 로그인한 이메일을 넣고 다시 로그인하면 관리자가
      됩니다. 여러 사람은 쉼표로 구분합니다.
    </p>
    <Link href="/" className="text-green underline">
      홈으로
    </Link>
  </section>
);

export default ForbiddenPage;
