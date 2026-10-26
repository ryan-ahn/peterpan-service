import type { Metadata } from "next";

import FoundationHeader from "@components/foundationHeader";

export const metadata: Metadata = { title: "대표 인사말" };

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
