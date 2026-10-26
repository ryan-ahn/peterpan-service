"use client";

import { useEffect, useRef } from "react";

import { type Variant, useToast } from "@repo/ui/components/toast";

/**
 * types
 */
type Props = {
  text: string;
  variant?: Variant;
  param: string;
};

/**
 * 서버 액션이 주소 쿼리로 넘긴 결과를 토스트로 한 번 띄우고, 새로고침에 다시 뜨지 않게 쿼리를 지운다
 * @param text 토스트 문구
 * @param variant 토스트 종류 (기본 success)
 * @param param 지울 쿼리 이름 (예: saved)
 */
const FlashToast = ({ text, variant = "success", param }: Props) => {
  // hooks
  const toast = useToast();
  // refs
  const hasShownRef = useRef(false);
  // effects
  useEffect(() => {
    if (hasShownRef.current) return;
    hasShownRef.current = true;
    toast.show({ text, variant });
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState(null, "", url);
  }, [toast, text, variant, param]);
  // render
  return null;
};

export default FlashToast;
