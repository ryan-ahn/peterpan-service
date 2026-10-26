import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import type { BylawOutline } from "./bylawOutline";

/**
 * 로그인 사용자. id는 Supabase Auth 사용자 id와 같다.
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email"),
    name: text("name").notNull().default(""),
    avatarUrl: text("avatar_url"),
    provider: text("provider").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [
    unique("profiles_provider_user").on(table.provider, table.providerUserId),
  ],
);

/**
 * 어드민 권한. 오너는 한 명으로 고정하고, 매니저는 오너가 지정·해제한다. 행이 없으면 일반 회원.
 */
export const adminMembers = pgTable("admin_members", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => profiles.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  role: text("role").notNull(),
  grantedBy: uuid("granted_by").references(() => profiles.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * 재단소식(활동·언론보도), 경영공시, 기부금 공시. 공지는 notices에 따로 둔다.
 */
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  board: text("board").notNull(),
  category: text("category"),
  year: integer("year"),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  pinned: boolean("pinned").notNull().default(false),
  published: boolean("published").notNull().default(true),
  externalUrl: text("external_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * 공지사항. 웹사이트 재단소식 게시판에 공지 분류로 함께 보인다.
 */
export const notices = pgTable("notices", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  pinned: boolean("pinned").notNull().default(false),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * 회원 게시판. 로그인한 회원이 쓰고, 글쓴이와 어드민이 고치거나 지운다.
 * author_name은 쓸 때의 이름이다. 회원이 탈퇴하면 author_id만 비운다.
 */
export const boardPosts = pgTable("board_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").references(() => profiles.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  authorName: text("author_name").notNull().default(""),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * 게시판 댓글. 글이 지워지면 함께 지운다.
 */
export const boardComments = pgTable("board_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => boardPosts.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => profiles.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  authorName: text("author_name").notNull().default(""),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * 게시판 좋아요. 회원 한 명이 글 하나에 한 번만 누른다.
 */
export const boardLikes = pgTable(
  "board_likes",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => boardPosts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [primaryKey({ columns: [table.postId, table.userId] })],
);

/**
 * 언론보도 수집 대기열. 네이버 뉴스 검색으로 매일 모으고, 운영자가 승인하면 posts(news·press)에 글을 만든다.
 * 기사 본문은 저장하지 않고 제목·요약·원문 링크만 둔다.
 */
export const pressCandidates = pgTable("press_candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  publisher: text("publisher").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  keyword: text("keyword").notNull().default(""),
  status: text("status").notNull().default("pending"),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const postFiles = pgTable("post_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  bucket: text("bucket").notNull(),
  path: text("path").notNull(),
  fileName: text("file_name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

/**
 * 정관 파일. 올린 판을 모두 남기고, 웹사이트에는 published 1건만 보인다.
 * outline은 올릴 때 PDF에서 뽑은 장·조 목차와 조문이다 (스캔 PDF면 null).
 */
export const bylaws = pgTable("bylaws", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  revisedOn: date("revised_on"),
  bucket: text("bucket").notNull(),
  path: text("path").notNull(),
  fileName: text("file_name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull().default(0),
  outline: jsonb("outline").$type<BylawOutline>(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const donationInquiries = pgTable("donation_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull(),
  kind: text("kind").notNull(),
  amount: text("amount").notNull().default(""),
  message: text("message").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
