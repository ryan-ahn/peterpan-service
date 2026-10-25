import type { Metadata } from "next";

import ArticlePage from "@components/articlePage";
import { OPERATION_SECTIONS } from "@lib/foundation";

export const metadata: Metadata = { title: "운영 방향" };

/**
 * screen — 주거와 돌봄의 운영
 */
const OperationScreen = () => (
  <ArticlePage
    eyebrow="피터팬마을"
    title="주거와 돌봄의 운영"
    lead="주말에도 공백이 없는 365일 지원. 재단은 운영의 기준을 맡고, 집과 제도는 기업과 정부가 함께 채웁니다."
    sections={OPERATION_SECTIONS}
  />
);

export default OperationScreen;
