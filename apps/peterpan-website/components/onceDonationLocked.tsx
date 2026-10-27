"use client";

import { type ReactNode } from "react";

import { useToast } from "@repo/ui/components/toast";

/**
 * constants
 */
const TOAST_TEXT =
  "처음 후원은 조만간 열 예정입니다. 지금은 구글폼 약정 이행만 받고 있습니다.";

/**
 * types
 */
type Props = {
  children: ReactNode;
};

/**
 * 일시 후원 영역 전체를 비활성화하고, 탭하면 곧 열린다는 토스트를 띄운다
 */
const OnceDonationLocked = ({ children }: Props) => {
  // hooks
  const toast = useToast();
  // handlers
  const handleUnlockHint = () => {
    toast.show({ text: TOAST_TEXT, variant: "info" });
  };
  // render
  return (
    <div className="relative">
      <div className="pointer-events-none opacity-50 select-none" inert>
        {children}
      </div>
      <button
        type="button"
        className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
        aria-label="처음 후원 — 조만간 열 예정"
        onClick={handleUnlockHint}
      />
    </div>
  );
};

export default OnceDonationLocked;
