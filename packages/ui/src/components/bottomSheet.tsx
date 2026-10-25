"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import useOverlay from "../hooks/useOverlay";
import Icon from "../icon";

/**
 * types
 */
type Props = {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  isDismissable?: boolean;
  onClose: () => void;
};

/**
 * 아래에서 올라오는 시트. 모바일에서 선택지·필터·짧은 폼에 쓴다
 * @param isOpen 열림 여부
 * @param title 머리 제목. 있으면 닫기 버튼도 보인다
 * @param children 본문. 길면 시트 안에서 스크롤된다
 * @param footer 아래 고정 영역(버튼 등)
 * @param isDismissable 바깥 클릭·ESC로 닫을 수 있는지
 * @param onClose 닫기
 */
const BottomSheet = ({
  isOpen,
  title,
  children,
  footer,
  isDismissable = true,
  onClose,
}: Props) => {
  // hooks
  useOverlay({ isOpen: isOpen && isDismissable, onClose });
  // render
  if (!isOpen || typeof document === "undefined") {
    return null;
  }
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/40"
      onClick={isDismissable ? onClose : undefined}>
      <div
        className="flex max-h-[85dvh] w-full max-w-160 animate-sheet-up flex-col rounded-t-sheet bg-white safe-bottom shadow-large"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={event => event.stopPropagation()}>
        <span
          className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-gray-300"
          aria-hidden="true"
        />
        {title ? (
          <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-4 pb-2">
            <h2 className="text-6 leading-8 font-semibold text-gray-900">
              {title}
            </h2>
            <button
              className="grid size-9 cursor-pointer place-items-center rounded-full text-gray-500 hover:bg-gray-100"
              type="button"
              aria-label="닫기"
              onClick={onClose}>
              <Icon name="close" size={20} />
            </button>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 px-5 pt-2 pb-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};

export default BottomSheet;
