import type { ReactNode } from "react";

import Link from "next/link";

import { requireAdmin } from "@/lib/admin";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const user = await requireAdmin();
  return (
    <div className="bg-white">
      <div className="border-b border-beige">
        <div className="mx-auto flex w-[min(1100px,calc(100%-2rem))] flex-wrap items-center gap-4 py-4 text-sm">
          <strong className="text-green">관리</strong>
          <Link href="/admin">현황</Link>
          <Link href="/admin/posts">게시글</Link>
          <Link href="/admin/posts/new">새 글</Link>
          <Link href="/admin/inquiries">후원 문의</Link>
          <Link href="/admin/settings">기본정보</Link>
          <span className="ml-auto text-muted">{user.name}</span>
        </div>
      </div>
      <div className="mx-auto w-[min(1100px,calc(100%-2rem))] py-10">{children}</div>
    </div>
  );
};

export default AdminLayout;
