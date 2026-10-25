"use client";

import { useEffect, useEffectEvent } from "react";

/**
 * types
 */
type UseOverlayParams = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 모달·시트·드로어 공통 동작. 열려 있는 동안 ESC로 닫고 뒤 페이지 스크롤을 막는다
 */
const useOverlay = (params: UseOverlayParams) => {
  const { isOpen, onClose } = params;
  // handlers
  const handleEscape = useEffectEvent(onClose);
  // effects
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleEscape();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isOpen]);
};

export default useOverlay;
