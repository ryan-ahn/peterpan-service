import type { Metadata } from "next";
import Image from "next/image";

import ArticlePage from "@components/articlePage";
import { VILLAGE_SECTIONS } from "@lib/foundation";

export const metadata: Metadata = { title: "피터팬마을" };

/**
 * screen — 마을 소개
 */
const VillageScreen = () => (
  <ArticlePage
    eyebrow="피터팬마을"
    title="마을 소개"
    lead="지원주택, 치유농업, 민간의 동행을 한자리에 모으는 성인 자폐인을 위한 주거와 치유 마을. 이름은 피터팬 네버랜드입니다."
    sections={VILLAGE_SECTIONS}>
    <figure className="overflow-hidden rounded-3xlarge">
      <div className="relative h-80">
        <Image
          src="/images/village.jpg"
          alt="너른 들판과 하늘"
          fill
          className="object-cover"
          sizes="860px"
        />
      </div>
      <figcaption className="bg-white px-5 py-3 text-4 leading-5 text-muted">
        마을 사진이 생기기 전까지 둔 예시 이미지입니다. 부지 사진은 확정 후
        교체합니다.
      </figcaption>
    </figure>
  </ArticlePage>
);

export default VillageScreen;
