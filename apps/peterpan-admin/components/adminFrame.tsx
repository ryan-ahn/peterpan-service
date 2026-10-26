"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

import AdminShell, { type AdminHeaderSearch } from "@components/adminShell";
import type { AdminSelf } from "@lib/adminSession";

/**
 * types
 */
type Props = {
  self: AdminSelf;
  children: ReactNode;
};

/**
 * hooks
 */
const AdminHeaderContext = createContext<
  (search: AdminHeaderSearch | null) => void
>(() => {});

const AdminSelfContext = createContext<AdminSelf | null>(null);

/**
 * 화면이 위쪽 검색 바를 등록한다. 화면을 떠나면 지운다
 */
const useAdminHeader = (search: AdminHeaderSearch) => {
  const setHeader = useContext(AdminHeaderContext);
  const { value, placeholder, onChange, onSubmit } = search;
  // effects
  useLayoutEffect(() => {
    setHeader({ value, placeholder, onChange, onSubmit });
    return () => setHeader(null);
  }, [onChange, onSubmit, placeholder, setHeader, value]);
};

/**
 * 로그인한 운영자. 관리 화면 안에서만 부른다
 */
const useAdminSelf = () => {
  const self = useContext(AdminSelfContext);
  if (!self) {
    throw new Error("useAdminSelf는 AdminFrame 안에서만 쓸 수 있어요.");
  }
  return self;
};

/**
 * 관리 화면 공통 틀. 셸과 검색 바 상태를 잇는다. 운영자 확인은 `(manage)/layout.tsx`가 먼저 한다
 * @param self 로그인한 운영자
 * @param children 관리 화면
 */
const AdminFrame = ({ self, children }: Props) => {
  // states
  const [headerSearch, setHeaderSearch] = useState<AdminHeaderSearch | null>(
    null,
  );
  // render
  return (
    <AdminSelfContext value={self}>
      <AdminHeaderContext value={setHeaderSearch}>
        <AdminShell self={self} headerSearch={headerSearch}>
          {children}
        </AdminShell>
      </AdminHeaderContext>
    </AdminSelfContext>
  );
};

export default AdminFrame;
export { useAdminHeader, useAdminSelf };
