import type { Metadata } from "next";

import ArticlePage from "@components/articlePage";
import { FOUNDING_SECTIONS } from "@lib/foundation";

export const metadata: Metadata = { title: "설립 배경과 목적" };

/**
 * screen — 설립 배경과 목적
 */
const AboutScreen = () => (
  <ArticlePage
    eyebrow="재단소개"
    title="설립 배경과 목적"
    lead="성인 중증 자폐성장애인이 부모의 생애와 무관하게, 자신의 삶을 이어 갈 수 있는 법인을 만듭니다."
    sections={FOUNDING_SECTIONS}
  />
);

export default AboutScreen;
