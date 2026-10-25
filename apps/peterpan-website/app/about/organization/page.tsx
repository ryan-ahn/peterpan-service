import type { Metadata } from "next";

import ArticlePage from "@components/articlePage";
import { ORGANIZATION_SECTIONS } from "@lib/foundation";

export const metadata: Metadata = { title: "재단 정보" };

/**
 * screen — 재단 기본정보
 */
const OrganizationScreen = () => (
  <ArticlePage
    eyebrow="재단소개"
    title="재단 기본정보"
    lead="정관과 설립취지서에 적힌 법인 정보입니다. 전화번호, 이메일, 고유번호는 확정되는 대로 하단과 이 페이지에 반영합니다."
    sections={ORGANIZATION_SECTIONS}
  />
);

export default OrganizationScreen;
