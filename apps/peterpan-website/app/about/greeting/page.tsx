import type { Metadata } from "next";

import FoundationHeader from "@components/foundationHeader";

export const metadata: Metadata = {
  title: "대표 인사말",
  description:
    "재단법인 피터팬 자폐인복지재단 대표 인사말. 재단이 걸어갈 길과 함께해 주실 분들께 드리는 인사입니다.",
};

/**
 * screen — 대표 인사말. 인사말을 받기 전까지 준비 중으로 둔다
 */
const GreetingScreen = () => (
  <article>
    <FoundationHeader
      overline="Greeting"
      title="대표 인사말"
      lead="준비 중입니다."
    />
  </article>
);

export default GreetingScreen;
