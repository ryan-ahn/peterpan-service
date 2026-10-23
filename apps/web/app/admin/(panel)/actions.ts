"use server";

import { eq } from "drizzle-orm";
import { getDb, postFiles, posts } from "@repo/db";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { saveSiteContact, type SiteContact } from "@/lib/settings";

const BOARDS = new Set(["news", "management", "donation"]);
const CATEGORIES = new Set(["notice", "activity", "press"]);

export const savePost = async (formData: FormData) => {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const board = String(formData.get("board") ?? "");
  const categoryValue = String(formData.get("category") ?? "");
  const yearValue = String(formData.get("year") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  const published = formData.get("published") === "on";
  if (!BOARDS.has(board) || !title) {
    redirect("/admin/posts/new");
  }
  const category = CATEGORIES.has(categoryValue) ? categoryValue : null;
  const year = yearValue ? Number(yearValue) : null;
  const db = getDb();
  const now = new Date();
  let postId = id;
  if (id) {
    await db
      .update(posts)
      .set({
        board,
        category,
        year: Number.isFinite(year) ? year : null,
        title,
        summary,
        body,
        externalUrl: externalUrl || null,
        pinned,
        published,
        updatedAt: now,
      })
      .where(eq(posts.id, id));
  } else {
    const slug = `${board}-${crypto.randomUUID().slice(0, 8)}`;
    const inserted = await db
      .insert(posts)
      .values({
        slug,
        board,
        category,
        year: Number.isFinite(year) ? year : null,
        title,
        summary,
        body,
        externalUrl: externalUrl || null,
        pinned,
        published,
      })
      .returning({ id: posts.id });
    postId = inserted[0]?.id ?? "";
  }
  if (postId) {
    await uploadAttachments({ postId, formData });
  }
  redirect("/admin/posts");
};

export const deletePost = async (formData: FormData) => {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await getDb().delete(posts).where(eq(posts.id, id));
  }
  redirect("/admin/posts");
};

export const saveSettings = async (formData: FormData) => {
  await requireAdmin();
  const contact: SiteContact = {
    representative: String(formData.get("representative") ?? ""),
    address: String(formData.get("address") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    registrationNumber: String(formData.get("registrationNumber") ?? ""),
  };
  await saveSiteContact(contact);
  redirect("/admin/settings?saved=1");
};

const uploadAttachments = async (params: { postId: string; formData: FormData }) => {
  const files = params.formData
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0);
  if (files.length === 0) {
    return;
  }
  const admin = createAdminClient();
  const db = getDb();
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      continue;
    }
    const bucket = file.type.startsWith("image/") ? "media" : "documents";
    const path = `${params.postId}/${crypto.randomUUID()}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const uploaded = await admin.storage.from(bucket).upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploaded.error) {
      continue;
    }
    await db.insert(postFiles).values({
      postId: params.postId,
      bucket,
      path,
      fileName: file.name,
      mime: file.type || "application/octet-stream",
      size: file.size,
    });
  }
};
