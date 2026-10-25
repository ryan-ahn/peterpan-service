"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import useOverlay from "@repo/ui/hooks/useOverlay";
import Icon from "@repo/ui/icon";
import Text from "@repo/ui/text";

import { adminTextHeadingColor, adminTextLabelColor } from "@constants/adminUi";

/**
 * types
 */
type Props = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

/**
 * 오른쪽에서 열리는 편집 패널. 목록 행을 눌렀을 때 상세·수정에 쓴다
 * @param isOpen 열림 여부
 * @param title 제목
 * @param subtitle 제목 아래 설명
 * @param children 본문(폼)
 * @param footer 아래 고정 버튼 영역
 * @param onClose 닫기
 */
const AdminDrawer = ({
  isOpen,
  title,
  subtitle,
  children,
  footer,
  onClose,
}: Props) => {
  // hooks
  useOverlay({ isOpen, onClose });
  // render
  if (!isOpen || typeof document === "undefined") {
    return null;
  }
  return createPortal(
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        className="absolute inset-0 animate-fade-in bg-black/30"
        type="button"
        aria-label={`${title} 닫기`}
        onClick={onClose}
      />
      <aside
        className="relative flex h-full w-full max-w-110 flex-col bg-white shadow-large"
        role="dialog"
        aria-modal="true"
        aria-label={title}>
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 md:px-6 md:py-5">
          <div className="flex min-w-0 flex-col gap-1">
            <Text variant="heading-5" color={adminTextHeadingColor}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                variant="caption-1"
                color={adminTextLabelColor}
                className="break-all">
                {subtitle}
              </Text>
            ) : null}
          </div>
          <button
            className="grid size-9 shrink-0 place-items-center rounded-medium text-gray-500 hover:bg-gray-100"
            type="button"
            aria-label="닫기"
            onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 md:px-6">
          {children}
        </div>
        {footer ? (
          <div className="flex shrink-0 items-center gap-2 border-t border-gray-200 px-5 py-4 md:px-6">
            {footer}
          </div>
        ) : null}
      </aside>
    </div>,
    document.body,
  );
};

export default AdminDrawer;
