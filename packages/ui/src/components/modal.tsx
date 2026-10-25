"use client";

import { type ReactNode, useId } from "react";
import { createPortal } from "react-dom";

import useOverlay from "../hooks/useOverlay";
import cn from "../lib/cn";
import tv from "../lib/tv";
import Button from "./button";

/**
 * constants
 */
const panel = tv({
  base: "flex max-h-[calc(100dvh-48px)] w-full animate-pop-in flex-col gap-6 overflow-y-auto rounded-xlarge bg-white p-6 shadow-large",
  variants: {
    size: {
      small: "max-w-90",
      medium: "max-w-120",
      large: "max-w-160",
    },
  },
});

/**
 * types
 */
export type Size = "small" | "medium" | "large";

type ModalButton = {
  text: string;
  color?: "primary" | "black" | "danger";
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
};

type Props = {
  isOpen: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: Size;
  direction?: "row" | "column";
  primaryButton?: ModalButton;
  secondaryButton?: Omit<ModalButton, "color">;
  isDismissable?: boolean;
  onClose: () => void;
};

/**
 * 가운데 대화 상자. 확인·삭제처럼 결정이 필요한 순간에 쓴다
 * @param isOpen 열림 여부
 * @param title 제목
 * @param description 제목 아래 설명
 * @param children 본문(폼 등)
 * @param size 최대 너비
 * @param direction 버튼 배치. row 가로 / column 세로
 * @param primaryButton 주 동작 버튼
 * @param secondaryButton 보조 버튼(취소 등)
 * @param isDismissable 바깥 클릭·ESC로 닫을 수 있는지
 * @param onClose 닫기
 */
const Modal = ({
  isOpen,
  title,
  description,
  children,
  size = "small",
  direction = "row",
  primaryButton,
  secondaryButton,
  isDismissable = true,
  onClose,
}: Props) => {
  // hooks
  const titleId = useId();
  useOverlay({ isOpen: isOpen && isDismissable, onClose });
  // variables
  const hasButtons = Boolean(primaryButton || secondaryButton);
  // render
  if (!isOpen || typeof document === "undefined") {
    return null;
  }
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/40 p-6"
      onClick={isDismissable ? onClose : undefined}>
      <div
        className={panel({ size })}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={event => event.stopPropagation()}>
        <div className="flex flex-col gap-2">
          <h2
            className="text-6 leading-8 font-semibold text-gray-900"
            id={titleId}>
            {title}
          </h2>
          {description ? (
            <p className="text-4 leading-6 whitespace-pre-line text-gray-600">
              {description}
            </p>
          ) : null}
        </div>
        {children}
        {hasButtons ? (
          <div
            className={cn(
              "flex gap-2",
              direction === "column" ? "flex-col-reverse" : "flex-row",
            )}>
            {secondaryButton ? (
              <Button
                variant="solid"
                color="gray"
                text={secondaryButton.text}
                isFullWidth
                isDisabled={secondaryButton.isDisabled}
                isLoading={secondaryButton.isLoading}
                onClick={secondaryButton.onClick}
              />
            ) : null}
            {primaryButton ? (
              <Button
                variant="solid"
                color={primaryButton.color ?? "black"}
                text={primaryButton.text}
                isFullWidth
                isDisabled={primaryButton.isDisabled}
                isLoading={primaryButton.isLoading}
                onClick={primaryButton.onClick}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
