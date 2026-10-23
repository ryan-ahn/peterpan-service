import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb, posts } from "@repo/db";

import { BOARDS } from "@/lib/posts";

const AdminHome = async () => {
  const rows = await getDb().select().from(posts).orderBy(desc(posts.createdAt));
  const counts = BOARDS.map(board => ({
    ...board,
    count: rows.filter(row => row.board === board.id).length,
  }));
  return (
    <section>
      <h1 className="text-3xl font-semibold text-green">관리 현황</h1>
      <p className="mt-3 text-muted">
        소식, 경영공시, 기부금 공시를 올리고 하단 연락처를 고칩니다. 파일은
        글에 첨부하면 공개 버킷에 저장됩니다.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {counts.map(item => (
          <Link key={item.id} href="/admin/posts" className="rounded-3xl bg-paper p-6">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-green">{item.count}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AdminHome;
