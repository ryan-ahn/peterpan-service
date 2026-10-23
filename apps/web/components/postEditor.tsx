import { savePost } from "@/app/admin/(panel)/actions";
import { BOARDS, NEWS_CATEGORIES, type PostRecord } from "@/lib/posts";

const PostEditor = ({ post }: { post?: PostRecord }) => (
  <form action={savePost} className="grid max-w-3xl gap-4">
    <h1 className="text-3xl font-semibold text-green">{post ? "글 수정" : "새 글"}</h1>
    {post ? <input type="hidden" name="id" value={post.id} /> : null}
    <label className="grid gap-2 text-sm">
      게시판
      <select name="board" defaultValue={post?.board ?? "news"} className="h-12 rounded-2xl border border-beige px-4">
        {BOARDS.map(board => (
          <option key={board.id} value={board.id}>
            {board.label}
          </option>
        ))}
      </select>
    </label>
    <label className="grid gap-2 text-sm">
      소식 분류
      <select name="category" defaultValue={post?.category ?? ""} className="h-12 rounded-2xl border border-beige px-4">
        <option value="">없음</option>
        {NEWS_CATEGORIES.map(category => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>
    </label>
    <label className="grid gap-2 text-sm">
      연도
      <input name="year" type="number" defaultValue={post?.year ?? ""} className="h-12 rounded-2xl border border-beige px-4" />
    </label>
    <label className="grid gap-2 text-sm">
      제목
      <input name="title" required defaultValue={post?.title ?? ""} className="h-12 rounded-2xl border border-beige px-4" />
    </label>
    <label className="grid gap-2 text-sm">
      요약
      <input name="summary" defaultValue={post?.summary ?? ""} className="h-12 rounded-2xl border border-beige px-4" />
    </label>
    <label className="grid gap-2 text-sm">
      본문
      <textarea name="body" rows={12} defaultValue={post?.body ?? ""} className="rounded-2xl border border-beige px-4 py-3" />
    </label>
    <label className="grid gap-2 text-sm">
      외부 링크
      <input name="externalUrl" defaultValue={post?.externalUrl ?? ""} className="h-12 rounded-2xl border border-beige px-4" />
    </label>
    <label className="grid gap-2 text-sm">
      첨부파일
      <input name="files" type="file" multiple className="text-sm" />
    </label>
    <label className="flex items-center gap-2 text-sm">
      <input name="pinned" type="checkbox" defaultChecked={post?.pinned ?? false} />
      상단 고정
    </label>
    <label className="flex items-center gap-2 text-sm">
      <input name="published" type="checkbox" defaultChecked={post?.published ?? true} />
      공개
    </label>
    <button type="submit" className="h-12 rounded-full bg-green text-white">
      저장
    </button>
  </form>
);

export default PostEditor;
