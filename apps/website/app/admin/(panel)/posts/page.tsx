import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb, posts } from "@repo/db";

import { deletePost } from "@/app/admin/(panel)/actions";
import { BOARDS, categoryLabel } from "@/lib/posts";
import { formatDate } from "@/lib/format";

const AdminPostsPage = async () => {
  const rows = await getDb().select().from(posts).orderBy(desc(posts.createdAt));
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-green">게시글</h1>
        <Link href="/admin/posts/new" className="rounded-full bg-green px-4 py-2 text-sm text-white">
          새 글
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {rows.length === 0 ? <p className="text-muted">글이 없습니다.</p> : null}
        {rows.map(post => (
          <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-beige px-4 py-3">
            <div>
              <p className="text-sm text-gold-deep">
                {BOARDS.find(board => board.id === post.board)?.label} · {categoryLabel(post.category)}
                {post.published ? "" : " · 비공개"}
              </p>
              <Link href={`/admin/posts/${post.id}`} className="font-medium">
                {post.title}
              </Link>
              <p className="text-sm text-muted">{formatDate(post.createdAt)}</p>
            </div>
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="text-sm text-muted">
                삭제
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminPostsPage;
