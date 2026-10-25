import type { Metadata } from "next";

import ArticlePage from "@components/articlePage";
import { GREETING_SECTIONS } from "@lib/foundation";

export const metadata: Metadata = { title: "대표 인사말" };

/**
 * screen — 대표 인사말
 */
const GreetingScreen = () => (
  <ArticlePage
    eyebrow="재단소개"
    title="대표 인사말"
    lead="설립발기인 대표 변경희. 아래 글은 설립취지서의 지향을 재단의 인사로 옮긴 것입니다. 등기 이후 이사장 인사가 정해지면 이 면을 바꿉니다."
    sections={GREETING_SECTIONS}
  />
);

export default GreetingScreen;
