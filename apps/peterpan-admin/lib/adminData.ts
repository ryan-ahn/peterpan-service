"use server";

import { type SQL, and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { readAdminRole } from "@repo/auth/session";
import { createAdminClient } from "@repo/auth/supabase";
import {
  adminLogs,
  adminMembers,
  boardComments,
  boardPosts,
  bylaws,
  donationInquiries,
  getDb,
  notices,
  postFiles,
  posts,
  pressCandidates,
  profiles,
} from "@repo/db";
import {
  type BoardId,
  type NewsCategoryId,
  isBoardId,
  isNewsCategoryId,
  publicStorageUrl,
} from "@repo/db/boards";
import { readBylawOutline } from "@repo/db/bylawOutline";
import { extractBylawOutline } from "@repo/db/bylawPdf";
import {
  type OrganizationChart,
  getOrganizationChart,
  saveOrganizationChart,
} from "@repo/db/organization";
import {
  type SiteContact,
  getSiteContact,
  saveSiteContact,
} from "@repo/db/siteContact";

import { ADMIN_PAGE_SIZE } from "@constants/adminUi";
import {
  ADMIN_LOG_MENUS,
  ADMIN_MENU_LABEL,
  type AdminLogMenu,
  type AdminMenuId,
  isSuperRole,
  readAdminMenus,
} from "@lib/adminMenu";
import { type AdminSelf, assertMenu, assertSuper } from "@lib/adminSession";
import { type CollectPressResult, collectPress } from "@lib/pressCollector";

/**
 * 어드민 데이터. 화면(클라이언트)이 서버 액션으로 부른다.
 * 함수마다 첫 줄에서 그 메뉴를 쓸 수 있는 운영자인지 확인하고, 무언가 바꾸면 `writeLog`로 활동 기록을 남긴다.
 */

/**
 * constants
 */
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const LOG_TARGET_LIMIT = 200;

/**
 * types
 */
export type MemberRole = "owner" | "super" | "manager" | "member";

export type Member = {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  provider: string;
  role: MemberRole;
  menus: AdminMenuId[];
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

export type Notice = {
  id: string;
  slug: string;
  title: string;
  body: string;
  isPinned: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewsKind = "notice" | "activity" | "press";

export type PressStatus = "pending" | "approved" | "hidden";

export type PressCandidate = {
  id: string;
  url: string;
  title: string;
  summary: string;
  publisher: string;
  publishedAt: string;
  status: PressStatus;
};

/**
 * 소식 관리 목록 행. 공지는 notices, 활동은 posts(news·activity), 언론 보도는 press_candidates에서 온다
 */
export type NewsItem = {
  id: string;
  kind: NewsKind;
  title: string;
  isPinned: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  notice: Notice | null;
  post: Post | null;
  press: PressCandidate | null;
};

export type MemberPostFilter = "all" | "published" | "hidden";

export type MemberPost = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  isPublished: boolean;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MemberComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
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
  depositorName: string;
  wallName: string;
  message: string;
  createdAt: string;
};

export type Bylaw = {
  id: string;
  title: string;
  revisedOn: string | null;
  fileName: string;
  size: number;
  url: string;
  articleCount: number;
  isPublished: boolean;
  createdAt: string;
};

export type AdminLog = {
  id: string;
  actorName: string;
  menu: AdminLogMenu;
  action: string;
  target: string;
  createdAt: string;
};

export type ListResult<T, F extends string> = {
  items: T[];
  total: number;
  counts: Record<F | "all", number>;
};

type PostRow = typeof posts.$inferSelect;

type NoticeRow = typeof notices.$inferSelect;

type PressCandidateRow = typeof pressCandidates.$inferSelect;

export type MemberRoleFilter = Exclude<MemberRole, "owner">;

type ListMembersParams = {
  search: string;
  page: number;
  role: MemberRoleFilter | "all";
};

type ReadRoleFilterParams = {
  memberRole: SQL<MemberRole>;
  role: ListMembersParams["role"];
};

type SetMemberRoleParams = {
  id: string;
  role: MemberRoleFilter;
  menus: AdminMenuId[];
};

type ListPostsParams = {
  search: string;
  page: number;
  board: BoardId;
};

type ListNewsItemsParams = {
  search: string;
  page: number;
  kind: NewsKind;
  pressStatus: PressStatus | null;
};

type ListMemberPostsParams = {
  search: string;
  page: number;
  filter: MemberPostFilter;
};

type SetMemberPostPublishedParams = {
  id: string;
  isPublished: boolean;
};

type ListMemberCommentsParams = {
  postId: string;
};

type SaveNoticeParams = {
  id: string | null;
  title: string;
  body: string;
  isPinned: boolean;
  isPublished: boolean;
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
  table:
    | typeof posts
    | typeof notices
    | typeof donationInquiries
    | typeof boardPosts
    | typeof pressCandidates;
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

type ReadUploadErrorParams = {
  fileName: string;
  message: string;
};

type ToNewsItemParams = {
  notice?: Notice;
  post?: Post;
  press?: PressCandidate;
};

type ReadNewsRowsParams = {
  kind: NewsKind;
  page: number;
  noticeWhere: SQL | undefined;
  activityWhere: SQL | undefined;
  pressWhere: SQL | undefined;
};

type StoredFile = {
  bucket: string;
  path: string;
};

type ListLogsParams = {
  search: string;
  page: number;
  menu: AdminLogMenu | "all";
};

type WriteLogParams = {
  self: AdminSelf;
  menu: AdminLogMenu;
  action: string;
  target?: string;
};

type MemberTargetRow = {
  name: string;
  email: string | null;
};

type ReadRoleActionParams = {
  current: MemberRole;
  role: MemberRoleFilter;
};

/**
 * actions — 회원
 */
/**
 * 오너는 화면에서 슈퍼 관리자로 보인다. 슈퍼 관리자 필터·개수에 오너를 함께 넣는다
 */
export const listMembers = async (
  params: ListMembersParams,
): Promise<ListResult<Member, MemberRoleFilter>> => {
  const { search, page, role } = params;
  await assertMenu("members");
  const db = getDb();
  const memberRole = sql<MemberRole>`coalesce(${adminMembers.role}, 'member')`;
  const shownRole = sql<string>`case when ${memberRole} = 'owner' then 'super' else ${memberRole} end`;
  const searchFilter = matchKeyword({
    search,
    columns: [profiles.name, profiles.email],
  });
  const where = and(searchFilter, readRoleFilter({ memberRole, role }));
  const [rows, totalRows, roleRows] = await Promise.all([
    db
      .select({
        profile: profiles,
        role: memberRole,
        menus: adminMembers.menus,
      })
      .from(profiles)
      .leftJoin(adminMembers, eq(adminMembers.userId, profiles.id))
      .where(where)
      .orderBy(desc(profiles.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(profiles)
      .leftJoin(adminMembers, eq(adminMembers.userId, profiles.id))
      .where(where),
    db
      .select({ key: shownRole, count: sql<number>`count(*)::int` })
      .from(profiles)
      .leftJoin(adminMembers, eq(adminMembers.userId, profiles.id))
      .where(searchFilter)
      .groupBy(shownRole),
  ]);
  return {
    items: rows.map(row => ({
      id: row.profile.id,
      name: row.profile.name || "이름 없음",
      email: row.profile.email,
      avatarUrl: row.profile.avatarUrl,
      provider: row.profile.provider,
      role: readAdminRole(row.role) ?? "member",
      menus: readAdminMenus(row.menus ?? []),
      joinedAt: row.profile.createdAt.toISOString(),
    })),
    total: totalRows[0]?.count ?? 0,
    counts: countBy({
      rows: roleRows,
      keys: ["super", "manager", "member"] as const,
    }),
  };
};

/**
 * 권한 바꾸기. 슈퍼 관리자는 회원↔관리자와 관리자 메뉴를, 슈퍼 관리자 지정·해제는 오너만 한다
 */
export const setMemberRole = async (params: SetMemberRoleParams) => {
  const { id, role, menus } = params;
  const self = await assertSuper();
  if (id === self.id) {
    throw new Error("내 권한은 바꿀 수 없어요.");
  }
  const db = getDb();
  const current = await readMemberRole({ id });
  if (current === "owner") {
    throw new Error("이 계정의 권한은 바꿀 수 없어요.");
  }
  if ((current === "super" || role === "super") && self.role !== "owner") {
    throw new Error("슈퍼 관리자 지정·해제는 오너만 할 수 있어요.");
  }
  const profile = await db
    .select({ name: profiles.name })
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  if (!profile[0]) {
    throw new Error("회원을 찾지 못했어요.");
  }
  const memberName = profile[0].name || "이름 없음";
  const action = readRoleAction({ current, role });
  if (role === "member") {
    await db.delete(adminMembers).where(eq(adminMembers.userId, id));
    await writeLog({ self, menu: "permissions", action, target: memberName });
    return;
  }
  const savedMenus = role === "manager" ? readAdminMenus(menus) : [];
  const values = {
    role,
    menus: savedMenus,
    grantedBy: self.id,
    updatedAt: new Date(),
  };
  await db
    .insert(adminMembers)
    .values({ userId: id, ...values })
    .onConflictDoUpdate({ target: adminMembers.userId, set: values });
  await writeLog({
    self,
    menu: "permissions",
    action,
    target:
      role === "manager"
        ? `${memberName} (${savedMenus.map(menu => ADMIN_MENU_LABEL[menu]).join(", ")})`
        : memberName,
  });
};

/**
 * 회원 삭제. 관리자 계정은 오너·슈퍼 관리자만, 슈퍼 관리자 계정은 오너만 지운다
 */
export const deleteMember = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("members");
  if (id === self.id) {
    throw new Error("내 계정은 삭제할 수 없습니다.");
  }
  const target = await readMemberRole({ id });
  if (target === "owner") {
    throw new Error("이 계정은 삭제할 수 없어요.");
  }
  if (target === "super" && self.role !== "owner") {
    throw new Error("슈퍼 관리자 계정은 오너만 삭제할 수 있어요.");
  }
  if (target === "manager" && !isSuperRole(self.role)) {
    throw new Error("관리자 계정은 슈퍼 관리자만 삭제할 수 있어요.");
  }
  const deleted = await createAdminClient().auth.admin.deleteUser(id);
  if (deleted.error) {
    throw new Error(deleted.error.message);
  }
  const removed = await getDb()
    .delete(profiles)
    .where(eq(profiles.id, id))
    .returning({ name: profiles.name, email: profiles.email });
  await writeLog({
    self,
    menu: "members",
    action: "회원 삭제",
    target: readMemberTarget(removed[0]),
  });
};

/**
 * actions — 회원 게시물. 웹사이트 게시판(board_posts)에 회원이 올린 글과 댓글
 */
export const listMemberPosts = async (
  params: ListMemberPostsParams,
): Promise<ListResult<MemberPost, Exclude<MemberPostFilter, "all">>> => {
  const { search, page, filter } = params;
  await assertMenu("posts");
  const db = getDb();
  const searchFilter = matchKeyword({
    search,
    columns: [boardPosts.title, boardPosts.body, boardPosts.authorName],
  });
  const where = and(
    searchFilter,
    filter === "all"
      ? undefined
      : eq(boardPosts.published, filter === "published"),
  );
  const shownState = sql<string>`case when ${boardPosts.published} then 'published' else 'hidden' end`;
  const [rows, total, stateRows] = await Promise.all([
    db
      .select({
        post: boardPosts,
        likeCount: sql<number>`(select count(*)::int from board_likes where board_likes.post_id = board_posts.id)`,
        commentCount: sql<number>`(select count(*)::int from board_comments where board_comments.post_id = board_posts.id)`,
      })
      .from(boardPosts)
      .where(where)
      .orderBy(desc(boardPosts.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page)),
    countRows({ table: boardPosts, where }),
    db
      .select({ key: shownState, count: sql<number>`count(*)::int` })
      .from(boardPosts)
      .where(searchFilter)
      .groupBy(shownState),
  ]);
  return {
    items: rows.map(row => ({
      id: row.post.id,
      title: row.post.title,
      body: row.post.body,
      authorName: row.post.authorName || "회원",
      isPublished: row.post.published,
      commentCount: row.commentCount,
      likeCount: row.likeCount,
      createdAt: row.post.createdAt.toISOString(),
      updatedAt: row.post.updatedAt.toISOString(),
    })),
    total,
    counts: countBy({
      rows: stateRows,
      keys: ["published", "hidden"] as const,
    }),
  };
};

export const listMemberComments = async (
  params: ListMemberCommentsParams,
): Promise<MemberComment[]> => {
  const { postId } = params;
  await assertMenu("posts");
  const rows = await getDb()
    .select()
    .from(boardComments)
    .where(eq(boardComments.postId, postId))
    .orderBy(boardComments.createdAt);
  return rows.map(row => ({
    id: row.id,
    authorName: row.authorName || "회원",
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  }));
};

/**
 * 숨기면 웹사이트 목록·본문에서 사라진다. 글쓴이에게도 보이지 않는다
 */
export const setMemberPostPublished = async (
  params: SetMemberPostPublishedParams,
) => {
  const { id, isPublished } = params;
  const self = await assertMenu("posts");
  const updated = await getDb()
    .update(boardPosts)
    .set({ published: isPublished })
    .where(eq(boardPosts.id, id))
    .returning({ title: boardPosts.title });
  await writeLog({
    self,
    menu: "posts",
    action: isPublished ? "게시글 공개" : "게시글 숨김",
    target: updated[0]?.title,
  });
};

export const deleteMemberPost = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("posts");
  const removed = await getDb()
    .delete(boardPosts)
    .where(eq(boardPosts.id, id))
    .returning({ title: boardPosts.title });
  await writeLog({
    self,
    menu: "posts",
    action: "게시글 삭제",
    target: removed[0]?.title,
  });
};

export const deleteMemberComment = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("posts");
  const removed = await getDb()
    .delete(boardComments)
    .where(eq(boardComments.id, id))
    .returning({ body: boardComments.body });
  await writeLog({
    self,
    menu: "posts",
    action: "댓글 삭제",
    target: removed[0]?.body,
  });
};

/**
 * actions — 소식. 공지(notices)와 활동(posts news·activity)을 한 화면에서 나눠 본다
 */
export const listNewsItems = async (
  params: ListNewsItemsParams,
): Promise<
  ListResult<NewsItem, NewsKind> & {
    pressCounts: Record<PressStatus | "all", number>;
  }
> => {
  const { search, page, kind, pressStatus } = params;
  await assertMenu("news");
  const noticeWhere = matchKeyword({
    search,
    columns: [notices.title, notices.body],
  });
  const activityWhere = and(
    eq(posts.board, "news"),
    eq(posts.category, "activity"),
    matchKeyword({ search, columns: [posts.title, posts.body] }),
  );
  const pressWhere = matchKeyword({
    search,
    columns: [
      pressCandidates.title,
      pressCandidates.summary,
      pressCandidates.publisher,
    ],
  });
  const [noticeCount, activityCount, pressStatusRows, items] =
    await Promise.all([
      countRows({ table: notices, where: noticeWhere }),
      countRows({ table: posts, where: activityWhere }),
      getDb()
        .select({
          key: pressCandidates.status,
          count: sql<number>`count(*)::int`,
        })
        .from(pressCandidates)
        .where(pressWhere)
        .groupBy(pressCandidates.status),
      readNewsRows({
        kind,
        page,
        noticeWhere,
        activityWhere,
        pressWhere: and(
          pressWhere,
          pressStatus ? eq(pressCandidates.status, pressStatus) : undefined,
        ),
      }),
    ]);
  const pressCounts = countBy({
    rows: pressStatusRows,
    keys: ["pending", "approved", "hidden"] as const,
  });
  const totals: Record<NewsKind, number> = {
    notice: noticeCount,
    activity: activityCount,
    press: pressCounts.all,
  };
  return {
    items,
    total: kind === "press" ? pressCounts[pressStatus ?? "all"] : totals[kind],
    counts: { all: noticeCount + activityCount + pressCounts.all, ...totals },
    pressCounts,
  };
};

/**
 * 언론 보도 승인. posts에 언론 보도 글(원문 링크)을 만들고 공개한다
 */
export const approvePress = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("news");
  const db = getDb();
  const rows = await db
    .select()
    .from(pressCandidates)
    .where(eq(pressCandidates.id, id))
    .limit(1);
  const candidate = rows[0];
  if (!candidate) {
    throw new Error("기사를 찾지 못했어요.");
  }
  if (candidate.status === "approved" && candidate.postId) {
    return;
  }
  await db.transaction(async tx => {
    const saved = await tx
      .insert(posts)
      .values({
        slug: `press-${crypto.randomUUID().slice(0, 8)}`,
        board: "news",
        category: "press",
        title: candidate.title,
        summary: candidate.publisher,
        body: candidate.summary,
        externalUrl: candidate.url,
        createdAt: candidate.publishedAt,
        updatedAt: candidate.publishedAt,
      })
      .returning({ id: posts.id });
    await tx
      .update(pressCandidates)
      .set({ status: "approved", postId: saved[0]?.id ?? null })
      .where(eq(pressCandidates.id, id));
  });
  await writeLog({
    self,
    menu: "news",
    action: "언론 보도 승인",
    target: candidate.title,
  });
};

/**
 * 언론 보도 숨김. 게시 중이면 웹사이트 글을 지운다. 다시 수집돼도 대기열에 올라오지 않는다
 */
export const hidePress = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("news");
  const db = getDb();
  const rows = await db
    .select({ postId: pressCandidates.postId, title: pressCandidates.title })
    .from(pressCandidates)
    .where(eq(pressCandidates.id, id))
    .limit(1);
  const postId = rows[0]?.postId;
  await db.transaction(async tx => {
    if (postId) {
      await tx.delete(posts).where(eq(posts.id, postId));
    }
    await tx
      .update(pressCandidates)
      .set({ status: "hidden", postId: null })
      .where(eq(pressCandidates.id, id));
  });
  await writeLog({
    self,
    menu: "news",
    action: "언론 보도 숨김",
    target: rows[0]?.title,
  });
};

export const collectPressNow = async (): Promise<CollectPressResult> => {
  const self = await assertMenu("news");
  const result = await collectPress();
  await writeLog({
    self,
    menu: "news",
    action: "언론 보도 수집",
    target: `기사 ${result.fetched}건 중 새 기사 ${result.added}건`,
  });
  return result;
};

/**
 * actions — 게시물 (재단 소식 활동, 경영 공시, 기부금 공시)
 */
export const listPosts = async (
  params: ListPostsParams,
): Promise<ListResult<Post, BoardId>> => {
  const { search, page, board } = params;
  await assertMenu("disclosures");
  const db = getDb();
  const searchFilter = matchKeyword({
    search,
    columns: [posts.title, posts.body],
  });
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
 * actions — 공지사항. notices 테이블. 웹사이트 재단 소식에 공지 분류로 함께 보인다
 */
export const saveNotice = async (params: SaveNoticeParams): Promise<Notice> => {
  const { id, isPinned, isPublished } = params;
  const self = await assertMenu("news");
  const title = params.title.trim();
  const body = params.body.trim();
  if (!title) {
    throw new Error("제목을 입력해 주세요.");
  }
  if (!body) {
    throw new Error("내용을 입력해 주세요.");
  }
  const values = { title, body, pinned: isPinned, published: isPublished };
  const db = getDb();
  const saved = id
    ? await db
        .update(notices)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(notices.id, id))
        .returning()
    : await db
        .insert(notices)
        .values({
          ...values,
          slug: `notice-${crypto.randomUUID().slice(0, 8)}`,
        })
        .returning();
  const row = saved[0];
  if (!row) {
    throw new Error("공지를 찾지 못했습니다.");
  }
  await writeLog({
    self,
    menu: "news",
    action: id ? "공지 수정" : "공지 작성",
    target: row.title,
  });
  return toNotice(row);
};

export const deleteNotice = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("news");
  const removed = await getDb()
    .delete(notices)
    .where(eq(notices.id, id))
    .returning({ title: notices.title });
  await writeLog({
    self,
    menu: "news",
    action: "공지 삭제",
    target: removed[0]?.title,
  });
};

/**
 * 글 저장. 첨부파일이 있어 FormData로 받는다.
 * 필드: id, board, category, year, title, summary, body, externalUrl, isPinned, isPublished, files
 */
export const savePost = async (formData: FormData): Promise<Post> => {
  const self = await assertMenu("news", "disclosures");
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
      board === "news" &&
      isNewsCategoryId(categoryValue) &&
      categoryValue !== "notice"
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
  await writeLog({
    self,
    menu: readPostMenu(row.board),
    action: id ? "글 수정" : "글 작성",
    target:
      files.length > 0 ? `${row.title} (첨부 ${files.length}개)` : row.title,
  });
  return toPost(row);
};

export const deletePost = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("news", "disclosures");
  const db = getDb();
  const files = await db
    .select()
    .from(postFiles)
    .where(eq(postFiles.postId, id));
  await removeStoredFiles(files);
  const removed = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning({ title: posts.title, board: posts.board });
  const row = removed[0];
  if (!row) {
    return;
  }
  await writeLog({
    self,
    menu: readPostMenu(row.board),
    action: "글 삭제",
    target: row.title,
  });
};

export const listPostFiles = async (
  params: ListPostFilesParams,
): Promise<PostFile[]> => {
  const { postId } = params;
  await assertMenu("news", "disclosures");
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
  const self = await assertMenu("news", "disclosures");
  const db = getDb();
  const files = await db
    .select({
      bucket: postFiles.bucket,
      path: postFiles.path,
      fileName: postFiles.fileName,
      postTitle: posts.title,
      board: posts.board,
    })
    .from(postFiles)
    .innerJoin(posts, eq(posts.id, postFiles.postId))
    .where(eq(postFiles.id, id));
  await removeStoredFiles(files);
  await db.delete(postFiles).where(eq(postFiles.id, id));
  const file = files[0];
  if (!file) {
    return;
  }
  await writeLog({
    self,
    menu: readPostMenu(file.board),
    action: "첨부파일 삭제",
    target: `${file.postTitle} · ${file.fileName}`,
  });
};

/**
 * actions — 후원 문의
 */
export const listInquiries = async (
  params: ListInquiriesParams,
): Promise<ListResult<Inquiry, never>> => {
  const { search, page } = params;
  await assertMenu("inquiries");
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
      depositorName: row.depositorName,
      wallName: row.wallName,
      message: row.message,
      createdAt: row.createdAt.toISOString(),
    })),
    total,
    counts: { all: total },
  };
};

export const deleteInquiry = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("inquiries");
  const removed = await getDb()
    .delete(donationInquiries)
    .where(eq(donationInquiries.id, id))
    .returning({
      name: donationInquiries.name,
      createdAt: donationInquiries.createdAt,
    });
  const row = removed[0];
  await writeLog({
    self,
    menu: "inquiries",
    action: "후원 문의 삭제",
    target: row
      ? `${row.name} (${row.createdAt.toISOString().slice(0, 10)} 접수)`
      : "",
  });
};

/**
 * actions — 조직도 (웹사이트 재단소개 조직도)
 */
export const readOrganization = async (): Promise<OrganizationChart> => {
  await assertMenu("organization");
  return getOrganizationChart();
};

export const saveOrganization = async (chart: OrganizationChart) => {
  const self = await assertMenu("organization");
  await saveOrganizationChart(chart);
  await writeLog({ self, menu: "organization", action: "조직도 저장" });
};

/**
 * actions — 정관. 올린 판을 모두 남기고 노출은 1건만
 */
export const listBylaws = async (): Promise<Bylaw[]> => {
  await assertMenu("bylaws");
  const rows = await getDb()
    .select()
    .from(bylaws)
    .orderBy(desc(bylaws.createdAt));
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    revisedOn: row.revisedOn,
    fileName: row.fileName,
    size: row.size,
    url: publicStorageUrl({ bucket: row.bucket, path: row.path }),
    articleCount: countArticles(row.outline),
    isPublished: row.published,
    createdAt: row.createdAt.toISOString(),
  }));
};

/**
 * 정관 추가. 필드: title, revisedOn(YYYY-MM-DD), isPublished, file
 */
export const addBylaw = async (formData: FormData) => {
  const self = await assertMenu("bylaws");
  const title = formText({ formData, key: "title" });
  const revisedOn = formText({ formData, key: "revisedOn" });
  const file = formData.get("file");
  if (!title) {
    throw new Error("제목을 입력해 주세요.");
  }
  if (revisedOn && !/^\d{4}-\d{2}-\d{2}$/.test(revisedOn)) {
    throw new Error("제·개정일은 2026-09-15처럼 적어 주세요.");
  }
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("정관 파일을 골라 주세요.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("파일은 20MB까지 올릴 수 있습니다.");
  }
  const mime = file.type || "application/octet-stream";
  const path = `bylaws/${crypto.randomUUID()}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const outline =
    mime === "application/pdf"
      ? await extractBylawOutline(bytes.slice()).catch(() => null)
      : null;
  const uploaded = await createAdminClient()
    .storage.from("documents")
    .upload(path, bytes, {
      contentType: mime,
      upsert: false,
    });
  if (uploaded.error) {
    throw new Error(
      readUploadError({ fileName: file.name, message: uploaded.error.message }),
    );
  }
  const saved = await getDb()
    .insert(bylaws)
    .values({
      title,
      revisedOn: revisedOn || null,
      bucket: "documents",
      path,
      fileName: file.name,
      mime,
      size: file.size,
      outline,
    })
    .returning({ id: bylaws.id });
  const id = saved[0]?.id;
  const isPublished = Boolean(id) && formData.get("isPublished") === "true";
  if (id && isPublished) {
    await markBylawPublished({ id });
  }
  await writeLog({
    self,
    menu: "bylaws",
    action: isPublished ? "정관 추가·노출" : "정관 추가",
    target: title,
  });
};

export const publishBylaw = async (params: IdParams) => {
  const self = await assertMenu("bylaws");
  await markBylawPublished(params);
  const rows = await getDb()
    .select({ title: bylaws.title })
    .from(bylaws)
    .where(eq(bylaws.id, params.id))
    .limit(1);
  await writeLog({
    self,
    menu: "bylaws",
    action: "정관 노출",
    target: rows[0]?.title,
  });
};

export const deleteBylaw = async (params: IdParams) => {
  const { id } = params;
  const self = await assertMenu("bylaws");
  const db = getDb();
  const rows = await db.select().from(bylaws).where(eq(bylaws.id, id));
  const row = rows[0];
  if (!row) {
    return;
  }
  if (row.published) {
    throw new Error(
      "노출 중인 정관은 지울 수 없어요. 다른 정관을 먼저 노출해 주세요.",
    );
  }
  await removeStoredFiles([row]);
  await db.delete(bylaws).where(eq(bylaws.id, id));
  await writeLog({
    self,
    menu: "bylaws",
    action: "정관 삭제",
    target: row.title,
  });
};

/**
 * actions — 기본 정보 (웹사이트 하단 연락처)
 */
export const readContact = async (): Promise<SiteContact> => {
  await assertMenu("settings");
  return getSiteContact();
};

export const saveContact = async (contact: SiteContact) => {
  const self = await assertMenu("settings");
  await saveSiteContact({
    representative: contact.representative.trim(),
    address: contact.address.trim(),
    phone: contact.phone.trim(),
    email: contact.email.trim(),
    registrationNumber: contact.registrationNumber.trim(),
  });
  await writeLog({ self, menu: "settings", action: "기본 정보 저장" });
};

/**
 * actions — 관리 기록. 운영자 활동 기록을 새것부터 읽는다
 */
export const listLogs = async (
  params: ListLogsParams,
): Promise<ListResult<AdminLog, AdminLogMenu>> => {
  const { search, page, menu } = params;
  await assertMenu("logs");
  const db = getDb();
  const searchFilter = matchKeyword({
    search,
    columns: [adminLogs.actorName, adminLogs.action, adminLogs.target],
  });
  const where = and(
    searchFilter,
    menu === "all" ? undefined : eq(adminLogs.menu, menu),
  );
  const [rows, totalRows, menuRows] = await Promise.all([
    db
      .select()
      .from(adminLogs)
      .where(where)
      .orderBy(desc(adminLogs.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(adminLogs)
      .where(where),
    db
      .select({ key: adminLogs.menu, count: sql<number>`count(*)::int` })
      .from(adminLogs)
      .where(searchFilter)
      .groupBy(adminLogs.menu),
  ]);
  return {
    items: rows.map(row => ({
      id: row.id,
      actorName: row.actorName || "알 수 없음",
      menu: row.menu as AdminLogMenu,
      action: row.action,
      target: row.target,
      createdAt: row.createdAt.toISOString(),
    })),
    total: totalRows[0]?.count ?? 0,
    counts: countBy({
      rows: menuRows,
      keys: [...ADMIN_LOG_MENUS],
    }),
  };
};

/**
 * utils
 */
const pageOffset = (page: number) => (Math.max(1, page) - 1) * ADMIN_PAGE_SIZE;

/**
 * 활동 기록 한 줄. 기록이 실패해도 이미 끝난 작업은 그대로 두고 서버 로그에만 남긴다
 */
const writeLog = async (params: WriteLogParams) => {
  const { self, menu, action, target = "" } = params;
  try {
    await getDb()
      .insert(adminLogs)
      .values({
        actorId: self.id,
        actorName: self.name,
        menu,
        action,
        target: target.replace(/\s+/g, " ").trim().slice(0, LOG_TARGET_LIMIT),
      });
  } catch (logError) {
    console.error("[admin log]", action, logError);
  }
};

const readRoleAction = (params: ReadRoleActionParams) => {
  const { current, role } = params;
  if (role === "member") {
    return current === "super" ? "슈퍼 관리자 해제" : "관리자 해제";
  }
  if (role === "super") {
    return "슈퍼 관리자 지정";
  }
  return current === "manager" ? "메뉴 권한 변경" : "관리자 지정";
};

const readMemberTarget = (member: MemberTargetRow | undefined) => {
  if (!member) {
    return "";
  }
  const name = member.name || "이름 없음";
  return member.email ? `${name} (${member.email})` : name;
};

const readPostMenu = (board: string): AdminLogMenu =>
  board === "news" ? "news" : "disclosures";

const readMemberRole = async (params: IdParams): Promise<MemberRole> => {
  const { id } = params;
  const rows = await getDb()
    .select({ role: adminMembers.role })
    .from(adminMembers)
    .where(eq(adminMembers.userId, id))
    .limit(1);
  return readAdminRole(rows[0]?.role) ?? "member";
};

const markBylawPublished = async (params: IdParams) => {
  const { id } = params;
  await getDb().transaction(async tx => {
    await tx
      .update(bylaws)
      .set({ published: false })
      .where(eq(bylaws.published, true));
    await tx.update(bylaws).set({ published: true }).where(eq(bylaws.id, id));
  });
};

const readRoleFilter = (params: ReadRoleFilterParams) => {
  const { memberRole, role } = params;
  if (role === "all") {
    return undefined;
  }
  if (role === "super") {
    return sql`${memberRole} in ('owner', 'super')`;
  }
  return sql`${memberRole} = ${role}`;
};

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

const countArticles = (value: unknown) =>
  readBylawOutline(value)?.chapters.reduce(
    (sum, chapter) => sum + chapter.articles.length,
    0,
  ) ?? 0;

const readUploadError = (params: ReadUploadErrorParams) => {
  const { fileName, message } = params;
  if (/compact jws|invalid api key|jwt/i.test(message)) {
    return `${fileName}: 파일 저장소 인증에 실패했어요. 서버의 Supabase 서비스 키(SUPABASE_SERVICE_ROLE_KEY)를 확인해 주세요.`;
  }
  return `${fileName}: ${message}`;
};

const readNewsRows = async (
  params: ReadNewsRowsParams,
): Promise<NewsItem[]> => {
  const { kind, page, noticeWhere, activityWhere, pressWhere } = params;
  const db = getDb();
  if (kind === "notice") {
    const rows = await db
      .select()
      .from(notices)
      .where(noticeWhere)
      .orderBy(desc(notices.pinned), desc(notices.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page));
    return rows.map(row => toNewsItem({ notice: toNotice(row) }));
  }
  if (kind === "activity") {
    const rows = await db
      .select()
      .from(posts)
      .where(activityWhere)
      .orderBy(desc(posts.pinned), desc(posts.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset(pageOffset(page));
    return rows.map(row => toNewsItem({ post: toPost(row) }));
  }
  const rows = await db
    .select()
    .from(pressCandidates)
    .where(pressWhere)
    .orderBy(
      sql`case ${pressCandidates.status} when 'pending' then 0 when 'approved' then 1 else 2 end`,
      desc(pressCandidates.publishedAt),
    )
    .limit(ADMIN_PAGE_SIZE)
    .offset(pageOffset(page));
  return rows.map(row => toNewsItem({ press: toPressCandidate(row) }));
};

const toNewsItem = (params: ToNewsItemParams): NewsItem => {
  const { notice = null, post = null, press = null } = params;
  if (press) {
    return {
      id: press.id,
      kind: "press",
      title: press.title,
      isPinned: false,
      isPublished: press.status === "approved",
      createdAt: press.publishedAt,
      updatedAt: press.publishedAt,
      notice,
      post,
      press,
    };
  }
  const source = notice ?? post;
  if (!source) {
    throw new Error("소식을 읽지 못했어요.");
  }
  return {
    id: source.id,
    kind: notice ? "notice" : "activity",
    title: source.title,
    isPinned: source.isPinned,
    isPublished: source.isPublished,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    notice,
    post,
    press,
  };
};

const toPressCandidate = (row: PressCandidateRow): PressCandidate => ({
  id: row.id,
  url: row.url,
  title: row.title,
  summary: row.summary,
  publisher: row.publisher,
  publishedAt: row.publishedAt.toISOString(),
  status:
    row.status === "approved" || row.status === "hidden"
      ? row.status
      : "pending",
});

const toNotice = (row: NoticeRow): Notice => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  body: row.body,
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
      throw new Error(
        readUploadError({
          fileName: file.name,
          message: uploaded.error.message,
        }),
      );
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
