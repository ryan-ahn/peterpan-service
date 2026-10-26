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
 * 이름·사진은 처음 가입할 때 소셜 계정에서 한 번 채우고, 이후에는 회원이 마이페이지에서 고친다.
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email"),
    name: text("name").notNull().default(""),
    avatarUrl: text("avatar_url"),
    phone: text("phone").notNull().default(""),
    birthDate: date("birth_date"),
    provider: text("provider").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [
    unique("profiles_provider_user").on(table.provider, table.providerUserId),
  ],
);

/**
 * 어드민 권한. 행이 없으면 일반 회원.
 * owner 한 명 고정 / super 오너가 지정·해제, 모든 메뉴와 관리자 관리 / manager 슈퍼 관리자가 지정, `menus`에 든 메뉴만
 */
export const adminMembers = pgTable("admin_members", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => profiles.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  role: text("role").notNull(),
  menus: text("menus").array().notNull().default([]),
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
 * 재단 소식(활동·언론 보도), 경영 공시, 기부금 공시. 공지는 notices에 따로 둔다.
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
 * 공지사항. 웹사이트 재단 소식 게시판에 공지 분류로 함께 보인다.
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
 * author_name은 글쓴이 닉네임이다. 마이페이지에서 닉네임을 바꾸면 글·댓글 모두 함께 바뀐다.
 * 회원이 탈퇴하면 author_id만 비우고 마지막 닉네임은 남긴다.
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
 * 언론 보도 수집 대기열. 네이버 뉴스 검색으로 매일 모으고, 운영자가 승인하면 posts(news·press)에 글을 만든다.
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

/**
 * 어드민 활동 기록. 운영자가 바꾼 일을 한 줄씩 쌓고 지우지 않는다.
 * 계정이 지워져도 남도록 그때 이름(`actorName`)과 대상 이름(`target`)을 글로 함께 적는다
 */
export const adminLogs = pgTable("admin_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => profiles.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  actorName: text("actor_name").notNull().default(""),
  menu: text("menu").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull().default(""),
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

/**
 * 후원 알림. 공식 계좌로 보낸 뒤 남긴다. 로그인한 회원이 남기면 user_id가 붙어 마이페이지 문의 내역에 보인다.
 * wall_name은 재단 승인 뒤 이름 벽에 올릴 이름이다 (비우면 올리지 않는다).
 */
export const donationInquiries = pgTable("donation_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull(),
  kind: text("kind").notNull(),
  amount: text("amount").notNull().default(""),
  depositorName: text("depositor_name").notNull().default(""),
  wallName: text("wall_name").notNull().default(""),
  message: text("message").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
