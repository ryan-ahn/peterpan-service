"use server";

import {
  type SQL,
  and,
  desc,
  eq,
  ilike,
  isNull,
  ne,
  or,
  sql,
} from "drizzle-orm";

import { createAdminClient } from "@repo/auth/supabase";
import { donationInquiries, getDb, postFiles, posts, profiles } from "@repo/db";
import {
  type BoardId,
  type NewsCategoryId,
  isBoardId,
  isNewsCategoryId,
  publicStorageUrl,
} from "@repo/db/boards";
import {
  type SiteContact,
  getSiteContact,
  saveSiteContact,
} from "@repo/db/siteContact";

import { ADMIN_PAGE_SIZE } from "@constants/adminUi";
import { assertAdmin } from "@lib/adminSession";

/**
 * 어드민 데이터. 화면(클라이언트)이 서버 액션으로 부른다.
 * 함수마다 첫 줄에서 운영자인지 확인한다.
 */

/**
 * constants
 */
const MAX_FILE_SIZE = 20 * 1024 * 1024;

/**
 * types
 */
export type MemberRole = "admin" | "member";

export type Member = {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  provider: string;
  role: MemberRole;
  joinedAt: string;
};

export type Post = {
  id: string;
  slug: string;
  board: BoardId;
  category: NewsCategoryId | null;
  year: number | null;
  title: string;
  summary: string;
  body: string;
  externalUrl: string | null;
  isPinned: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PostFile = {
  id: string;
  fileName: string;
  mime: string;
  size: number;
  url: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  kind: string;
  amount: string;
  message: string;
  createdAt: string;
};

export type ListResult<T, F extends string> = {
  items: T[];
  total: number;
  counts: Record<F | "all", number>;
};

type PostRow = typeof posts.$inferSelect;

type ListMembersParams = {
  search: string;
  page: number;
  role: MemberRole | "all";
};

type UpdateMemberRoleParams = {
  id: string;
  role: MemberRole;
};

type ListPostsParams = {
  search: string;
  page: number;
  board: BoardId;
};

type ListNoticesParams = {
  search: string;
  page: number;
};

type ListInquiriesParams = {
  search: string;
  page: number;
};

type IdParams = {
  id: string;
};

type ListPostFilesParams = {
  postId: string;
};

type UploadAttachmentsParams = {
  postId: string;
  files: File[];
};

type CountRowsParams = {
  table: typeof profiles | typeof posts | typeof donationInquiries;
  where: SQL | undefined;
};

type CountByParams<F extends string> = {
  rows: { key: string; count: number }[];
  keys: readonly F[];
};

type MatchKeywordParams = {
  search: string;
  columns: Parameters<typeof ilike>[0][];
};

type FormTextParams = {
  formData: FormData;
  key: string;
};

type StoredFile = {
  bucket: string;
  path: string;
};

/**
 * actions — 회원
 */
export const listMembers = async (
  params: ListMembersParams,
): Promise<ListResult<Member, MemberRole>> => {
  const { search, page, role } = params;
  await assertAdmin();
  const db = getDb();
  const searchFilter = matchKeyword({
    search,
    columns: [profiles.name, profiles.email],
  });
  const where = and(
    searchFilter,
    role === "all" ? undefined : eq(profiles.role, role),
  );
  const [rows, total, roleRows] = await Promise.all([
    db
      .select()
      .from(profiles)
      .where(where)
      .orderBy(desc(profiles.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page)),
    countRows({ table: profiles, where }),
    db
      .select({ key: profiles.role, count: sql<number>`count(*)::int` })
      .from(profiles)
      .where(searchFilter)
      .groupBy(profiles.role),
  ]);
  return {
    items: rows.map(row => ({
      id: row.id,
      name: row.name || "이름 없음",
      email: row.email,
      avatarUrl: row.avatarUrl,
      provider: row.provider,
      role: row.role === "admin" ? "admin" : "member",
      joinedAt: row.createdAt.toISOString(),
    })),
    total,
    counts: countBy({ rows: roleRows, keys: ["admin", "member"] as const }),
  };
};

export const updateMemberRole = async (params: UpdateMemberRoleParams) => {
  const { id, role } = params;
  const self = await assertAdmin();
  if (id === self.id && role !== "admin") {
    throw new Error("내 계정의 관리자 권한은 해제할 수 없습니다.");
  }
  await getDb().update(profiles).set({ role }).where(eq(profiles.id, id));
};

export const deleteMember = async (params: IdParams) => {
  const { id } = params;
  const self = await assertAdmin();
  if (id === self.id) {
    throw new Error("내 계정은 삭제할 수 없습니다.");
  }
  const deleted = await createAdminClient().auth.admin.deleteUser(id);
  if (deleted.error) {
    throw new Error(deleted.error.message);
  }
  await getDb().delete(profiles).where(eq(profiles.id, id));
};

/**
 * actions — 게시물 (재단소식 활동·언론보도, 경영공시, 기부금 공시)
 */
export const listPosts = async (
  params: ListPostsParams,
): Promise<ListResult<Post, BoardId>> => {
  const { search, page, board } = params;
  await assertAdmin();
  const db = getDb();
  const searchFilter = and(
    matchKeyword({ search, columns: [posts.title, posts.body] }),
    or(isNull(posts.category), ne(posts.category, "notice")),
  );
  const where = and(searchFilter, eq(posts.board, board));
  const [rows, total, boardRows] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.pinned), desc(posts.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page)),
    countRows({ table: posts, where }),
    db
      .select({ key: posts.board, count: sql<number>`count(*)::int` })
      .from(posts)
      .where(searchFilter)
      .groupBy(posts.board),
  ]);
  return {
    items: rows.map(toPost),
    total,
    counts: countBy({
      rows: boardRows,
      keys: ["news", "management", "donation"] as const,
    }),
  };
};

/**
 * 공지는 재단소식 게시판의 notice 분류 글이다
 */
export const listNotices = async (
  params: ListNoticesParams,
): Promise<ListResult<Post, never>> => {
  const { search, page } = params;
  await assertAdmin();
  const where = and(
    eq(posts.board, "news"),
    eq(posts.category, "notice"),
    matchKeyword({ search, columns: [posts.title, posts.body] }),
  );
  const [rows, total] = await Promise.all([
    getDb()
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.pinned), desc(posts.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page)),
    countRows({ table: posts, where }),
  ]);
  return { items: rows.map(toPost), total, counts: { all: total } };
};

/**
 * 글 저장. 첨부파일이 있어 FormData로 받는다.
 * 필드: id, board, category, year, title, summary, body, externalUrl, isPinned, isPublished, files
 */
export const savePost = async (formData: FormData): Promise<Post> => {
  await assertAdmin();
  const id = formText({ formData, key: "id" });
  const board = formText({ formData, key: "board" });
  const categoryValue = formText({ formData, key: "category" });
  const yearValue = Number(formText({ formData, key: "year" }));
  const title = formText({ formData, key: "title" });
  const externalUrl = formText({ formData, key: "externalUrl" });
  if (!isBoardId(board)) {
    throw new Error("게시판을 골라 주세요.");
  }
  if (!title) {
    throw new Error("제목을 입력해 주세요.");
  }
  const files = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0);
  const tooLarge = files.find(file => file.size > MAX_FILE_SIZE);
  if (tooLarge) {
    throw new Error(`${tooLarge.name}: 파일은 20MB까지 올릴 수 있습니다.`);
  }
  const values = {
    board,
    category:
      board === "news" && isNewsCategoryId(categoryValue)
        ? categoryValue
        : null,
    year:
      board !== "news" && Number.isInteger(yearValue) && yearValue > 0
        ? yearValue
        : null,
    title,
    summary: formText({ formData, key: "summary" }),
    body: formText({ formData, key: "body" }),
    externalUrl: externalUrl || null,
    pinned: formData.get("isPinned") === "true",
    published: formData.get("isPublished") === "true",
  };
  const db = getDb();
  const saved = id
    ? await db
        .update(posts)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning()
    : await db
        .insert(posts)
        .values({
          ...values,
          slug: `${board}-${crypto.randomUUID().slice(0, 8)}`,
        })
        .returning();
  const row = saved[0];
  if (!row) {
    throw new Error("글을 찾지 못했습니다.");
  }
  await uploadAttachments({ postId: row.id, files });
  return toPost(row);
};

export const deletePost = async (params: IdParams) => {
  const { id } = params;
  await assertAdmin();
  const db = getDb();
  const files = await db
    .select()
    .from(postFiles)
    .where(eq(postFiles.postId, id));
  await removeStoredFiles(files);
  await db.delete(posts).where(eq(posts.id, id));
};

export const listPostFiles = async (
  params: ListPostFilesParams,
): Promise<PostFile[]> => {
  const { postId } = params;
  await assertAdmin();
  const rows = await getDb()
    .select()
    .from(postFiles)
    .where(eq(postFiles.postId, postId))
    .orderBy(desc(postFiles.createdAt));
  return rows.map(row => ({
    id: row.id,
    fileName: row.fileName,
    mime: row.mime,
    size: row.size,
    url: publicStorageUrl({ bucket: row.bucket, path: row.path }),
  }));
};

export const deletePostFile = async (params: IdParams) => {
  const { id } = params;
  await assertAdmin();
  const db = getDb();
  const files = await db.select().from(postFiles).where(eq(postFiles.id, id));
  await removeStoredFiles(files);
  await db.delete(postFiles).where(eq(postFiles.id, id));
};

/**
 * actions — 후원 문의
 */
export const listInquiries = async (
  params: ListInquiriesParams,
): Promise<ListResult<Inquiry, never>> => {
  const { search, page } = params;
  await assertAdmin();
  const where = matchKeyword({
    search,
    columns: [
      donationInquiries.name,
      donationInquiries.email,
      donationInquiries.phone,
    ],
  });
  const [rows, total] = await Promise.all([
    getDb()
      .select()
      .from(donationInquiries)
      .where(where)
      .orderBy(desc(donationInquiries.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page)),
    countRows({ table: donationInquiries, where }),
  ]);
  return {
    items: rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      kind: row.kind,
      amount: row.amount,
      message: row.message,
      createdAt: row.createdAt.toISOString(),
    })),
    total,
    counts: { all: total },
  };
};

export const deleteInquiry = async (params: IdParams) => {
  const { id } = params;
  await assertAdmin();
  await getDb().delete(donationInquiries).where(eq(donationInquiries.id, id));
};

/**
 * actions — 기본정보 (웹사이트 하단 연락처)
 */
export const readContact = async (): Promise<SiteContact> => {
  await assertAdmin();
  return getSiteContact();
};

export const saveContact = async (contact: SiteContact) => {
  await assertAdmin();
  await saveSiteContact({
    representative: contact.representative.trim(),
    address: contact.address.trim(),
    phone: contact.phone.trim(),
    email: contact.email.trim(),
    registrationNumber: contact.registrationNumber.trim(),
  });
};

/**
 * utils
 */
const pageOffset = (page: number) => (Math.max(1, page) - 1) * ADMIN_PAGE_SIZE;

const matchKeyword = (params: MatchKeywordParams) => {
  const { search, columns } = params;
  const keyword = search.trim();
  if (!keyword) {
    return undefined;
  }
  return or(...columns.map(column => ilike(column, `%${keyword}%`)));
};

const countRows = async (params: CountRowsParams) => {
  const { table, where } = params;
  const rows = await getDb()
    .select({ count: sql<number>`count(*)::int` })
    .from(table)
    .where(where);
  return rows[0]?.count ?? 0;
};

const countBy = <F extends string>(
  params: CountByParams<F>,
): Record<F | "all", number> => {
  const { rows, keys } = params;
  const counts = {
    all: rows.reduce((sum, row) => sum + row.count, 0),
  } as Record<F | "all", number>;
  keys.forEach(key => {
    counts[key] = rows.find(row => row.key === key)?.count ?? 0;
  });
  return counts;
};

const formText = (params: FormTextParams) => {
  const { formData, key } = params;
  return String(formData.get(key) ?? "").trim();
};

const toPost = (row: PostRow): Post => ({
  id: row.id,
  slug: row.slug,
  board: isBoardId(row.board) ? row.board : "news",
  category:
    row.category && isNewsCategoryId(row.category) ? row.category : null,
  year: row.year,
  title: row.title,
  summary: row.summary,
  body: row.body,
  externalUrl: row.externalUrl,
  isPinned: row.pinned,
  isPublished: row.published,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

const uploadAttachments = async (params: UploadAttachmentsParams) => {
  const { postId, files } = params;
  if (files.length === 0) {
    return;
  }
  const storage = createAdminClient().storage;
  const db = getDb();
  for (const file of files) {
    const mime = file.type || "application/octet-stream";
    const bucket = mime.startsWith("image/") ? "media" : "documents";
    const path = `${postId}/${crypto.randomUUID()}`;
    const uploaded = await storage
      .from(bucket)
      .upload(path, new Uint8Array(await file.arrayBuffer()), {
        contentType: mime,
        upsert: false,
      });
    if (uploaded.error) {
      throw new Error(`${file.name}: ${uploaded.error.message}`);
    }
    await db.insert(postFiles).values({
      postId,
      bucket,
      path,
      fileName: file.name,
      mime,
      size: file.size,
    });
  }
};

const removeStoredFiles = async (files: StoredFile[]) => {
  const storage = createAdminClient().storage;
  const buckets = [...new Set(files.map(file => file.bucket))];
  for (const bucket of buckets) {
    const paths = files
      .filter(file => file.bucket === bucket)
      .map(file => file.path);
    await storage.from(bucket).remove(paths);
  }
};
