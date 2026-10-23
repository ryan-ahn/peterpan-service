import Link from "next/link";

const NotFound = () => (
  <section className="mx-auto flex w-[min(640px,calc(100%-2rem))] flex-col gap-4 py-24">
    <h1 className="text-4xl font-semibold text-green">페이지를 찾지 못했습니다</h1>
    <Link href="/" className="text-green underline">
      홈으로
    </Link>
  </section>
);

export default NotFound;
