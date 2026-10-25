"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import Icon, { type Name as IconName } from "../icon";
import cn from "../lib/cn";

/**
 * constants
 */
const DURATION_MS = 2400;

const VARIANT_ICON: Record<Variant, IconName | null> = {
  default: null,
  success: "check-circle",
  error: "alert-circle",
  info: "info",
};

const VARIANT_ICON_CLASS_NAME: Record<Variant, string> = {
  default: "",
  success: "text-green-400",
  error: "text-red-300",
  info: "text-primary-300",
};

/**
 * types
 */
export type Variant = "default" | "success" | "error" | "info";

type ToastMessage = {
  id: number;
  text: string;
  variant: Variant;
};

type ShowParams = {
  text: string;
  variant?: Variant;
};

type ToastContextValue = {
  show: (params: ShowParams) => void;
};

type Props = {
  children: ReactNode;
};

/**
 * hooks
 */
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * 토스트 띄우기. `ToastProvider` 안에서만 쓴다
 */
const useToast = (): ToastContextValue => {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast는 ToastProvider 안에서 써야 합니다.");
  }
  return value;
};

/**
 * 화면 아래 잠깐 뜨는 알림. 앱 루트에 한 번 두고 `useToast().show`로 띄운다
 * @param children 앱 본문
 */
const ToastProvider = ({ children }: Props) => {
  // refs
  const nextIdRef = useRef(0);
  // states
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  // handlers
  const handleToastShow = useCallback((params: ShowParams) => {
    const { text, variant = "default" } = params;
    nextIdRef.current += 1;
    const id = nextIdRef.current;
    setMessages(current => [...current, { id, text, variant }]);
    window.setTimeout(() => {
      setMessages(current => current.filter(message => message.id !== id));
    }, DURATION_MS);
  }, []);
  // render
  return (
    <ToastContext value={{ show: handleToastShow }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-60 flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite">
        {messages.map(message => {
          const iconName = VARIANT_ICON[message.variant];
          return (
            <div
              key={message.id}
              className="flex max-w-120 animate-pop-in items-center gap-2 rounded-full bg-gray-900/90 px-4.5 py-3 text-4 leading-5 text-white shadow-large">
              {iconName ? (
                <Icon
                  name={iconName}
                  size={18}
                  className={cn(
                    "shrink-0",
                    VARIANT_ICON_CLASS_NAME[message.variant],
                  )}
                />
              ) : null}
              <span>{message.text}</span>
            </div>
          );
        })}
      </div>
    </ToastContext>
  );
};

export default ToastProvider;
export { useToast };
