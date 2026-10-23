import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "정보공개" };

const DisclosurePage = () => (
  <section className="mx-auto w-[min(980px,calc(100%-2rem))] py-16">
    <p className="text-sm text-gold-deep">정보공개</p>
    <h1 className="mt-2 text-4xl font-semibold text-green">경영과 기부를 공개합니다</h1>
    <p className="mt-4 max-w-2xl leading-8 text-muted">
      정관은 기부금 모금액과 활용실적, 사업실적을 홈페이지에 공개하도록 정하고 있습니다.
      설립 등기 이후의 회계연도 자료를 파일로 올립니다.
    </p>
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      <Link href="/disclosure/management" className="rounded-[2rem] bg-white p-8">
        <h2 className="text-2xl font-semibold text-green">경영공시</h2>
        <p className="mt-3 leading-7 text-muted">사업계획과 예산, 결산과 재무제표, 감사보고서.</p>
      </Link>
      <Link href="/disclosure/donations" className="rounded-[2rem] bg-white p-8">
        <h2 className="text-2xl font-semibold text-green">기부금 공시</h2>
        <p className="mt-3 leading-7 text-muted">모금과 활용 실적, 국세청 공시 자료 링크.</p>
      </Link>
    </div>
  </section>
);

export default DisclosurePage;
