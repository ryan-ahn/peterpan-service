"use client";

import { type ComponentProps, useState } from "react";

import Link from "next/link";

/**
 * types
 */
type Props = Omit<
  ComponentProps<typeof Link>,
  "prefetch" | "onMouseEnter" | "onTouchStart" | "onFocus"
>;

/**
 * 마우스를 올리거나·터치·포커스할 때만 프리페치하는 링크.
 * 모든 화면이 동적이라 프리페치마다 레이아웃이 서버에서 다시 그려지므로, 늘 보이는 메뉴 링크에 쓴다
 */
const HoverPrefetchLink = (props: Props) => {
  // states
  const [isActive, setIsActive] = useState(false);
  // handlers
  const handleIntent = () => {
    setIsActive(true);
  };
  // render
  return (
    <Link
      {...props}
      prefetch={isActive ? null : false}
      onMouseEnter={handleIntent}
      onTouchStart={handleIntent}
      onFocus={handleIntent}
    />
  );
};

export default HoverPrefetchLink;
