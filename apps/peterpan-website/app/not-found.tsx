import Link from "next/link";

import PageIntro from "@components/pageIntro";

/**
 * screen — 없는 주소
 */
const NotFoundScreen = () => (
  <section className="page-narrow flex flex-col gap-4 py-24">
    <PageIntro title="페이지를 찾지 못했습니다" />
    <Link href="/" className="text-pine underline">
      홈으로
    </Link>
  </section>
);

export default NotFoundScreen;
