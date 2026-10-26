import type { MetadataRoute } from "next";

import { and, desc, eq } from "drizzle-orm";

import { boardPosts, getDb, notices, posts } from "@repo/db";

import { SITE_URL } from "@lib/site";

/**
 * constants
 */
export const revalidate = 3600;

const DYNAMIC_LIMIT = 1000;

const STATIC_ROUTES: StaticRoute[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about/greeting", priority: 0.7, changeFrequency: "yearly" },
  { path: "/about/brand", priority: 0.6, changeFrequency: "yearly" },
  { path: "/about/vision", priority: 0.6, changeFrequency: "yearly" },
  { path: "/about/organization", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about/bylaws", priority: 0.6, changeFrequency: "monthly" },
  { path: "/village", priority: 0.9, changeFrequency: "monthly" },
  { path: "/village/spaces", priority: 0.8, changeFrequency: "monthly" },
  { path: "/village/operation", priority: 0.7, changeFrequency: "monthly" },
  { path: "/news", priority: 0.8, changeFrequency: "daily" },
  { path: "/board", priority: 0.5, changeFrequency: "daily" },
  { path: "/disclosure", priority: 0.6, changeFrequency: "monthly" },
  { path: "/disclosure/management", priority: 0.6, changeFrequency: "monthly" },
  { path: "/disclosure/donations", priority: 0.6, changeFrequency: "monthly" },
  { path: "/donate", priority: 0.9, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

/**
 * types
 */
type StaticRoute = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
};

type DatedPath = {
  path: string;
  updatedAt: Date;
};

/**
 * pre-root runtime
 */
const readNewsPaths = async (): Promise<DatedPath[]> => {
  const db = getDb();
  const [postRows, noticeRows] = await Promise.all([
    db
      .select({ slug: posts.slug, updatedAt: posts.updatedAt })
      .from(posts)
      .where(and(eq(posts.board, "news"), eq(posts.published, true)))
      .orderBy(desc(posts.updatedAt))
      .limit(DYNAMIC_LIMIT),
    db
      .select({ slug: notices.slug, updatedAt: notices.updatedAt })
      .from(notices)
      .where(eq(notices.published, true))
      .orderBy(desc(notices.updatedAt))
      .limit(DYNAMIC_LIMIT),
  ]);
  return [...postRows, ...noticeRows].map(row => ({
    path: `/news/${encodeURIComponent(row.slug)}`,
    updatedAt: row.updatedAt,
  }));
};

const readBoardPaths = async (): Promise<DatedPath[]> => {
  const rows = await getDb()
    .select({ id: boardPosts.id, updatedAt: boardPosts.updatedAt })
    .from(boardPosts)
    .where(eq(boardPosts.published, true))
    .orderBy(desc(boardPosts.updatedAt))
    .limit(DYNAMIC_LIMIT);
  return rows.map(row => ({
    path: `/board/${row.id}`,
    updatedAt: row.updatedAt,
  }));
};

/**
 * screen — sitemap.xml. 고정 화면과 공개된 소식·게시판 글
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [newsPaths, boardPaths] = await Promise.all([
    readNewsPaths().catch(() => []),
    readBoardPaths().catch(() => []),
  ]);
  return [
    ...STATIC_ROUTES.map(route => ({
      url: `${SITE_URL}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...newsPaths.map(item => ({
      url: `${SITE_URL}${item.path}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...boardPaths.map(item => ({
      url: `${SITE_URL}${item.path}`,
      lastModified: item.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.3,
    })),
  ];
};

export default sitemap;
