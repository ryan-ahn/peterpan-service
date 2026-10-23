import type { Metadata } from "next";
import Image from "next/image";

import ArticlePage from "@/components/articlePage";
import { SPACE_SECTIONS } from "@/content/foundation";

export const metadata: Metadata = { title: "조감과 공간" };

const SpacesPage = () => (
  <ArticlePage
    eyebrow="피터팬마을"
    title="조감과 주요 공간"
    lead="집은 모아 두지 않고 나무 사이로 나눕니다. 공동의 식탁과 치료, 텃밭과 산책로는 그 집들을 잇습니다."
    sections={SPACE_SECTIONS}>
    <div className="grid gap-4 md:grid-cols-2">
      <figure className="overflow-hidden rounded-3xl">
        <div className="relative h-56">
          <Image src="/images/garden.jpg" alt="밭과 하늘" fill className="object-cover" sizes="400px" />
        </div>
        <figcaption className="bg-white px-4 py-3 text-sm text-muted">치유농업 공간 예시</figcaption>
      </figure>
      <figure className="overflow-hidden rounded-3xl">
        <div className="relative h-56">
          <Image src="/images/path.jpg" alt="숲길" fill className="object-cover" sizes="400px" />
        </div>
        <figcaption className="bg-white px-4 py-3 text-sm text-muted">산책로 예시</figcaption>
      </figure>
    </div>
  </ArticlePage>
);

export default SpacesPage;
