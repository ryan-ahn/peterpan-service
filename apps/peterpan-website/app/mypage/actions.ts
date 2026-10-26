"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { and, eq, sql } from "drizzle-orm";

import { getSessionProfile, signOut } from "@repo/auth/session";
import { createServerSupabase } from "@repo/auth/supabase";
import {
  adminMembers,
  boardComments,
  boardPosts,
  donationInquiries,
  getDb,
  profiles,
} from "@repo/db";
import { AVATAR_UPLOAD, PROFILE_LIMIT, isAvatarType } from "@repo/db/boards";

import { isUuid } from "@lib/board";

/**
 * 마이페이지 쓰기. 모두 로그인한 본인 행만 고친다. 사진은 회원 세션으로 올려 스토리지 정책상 자기 폴더에만 쓸 수 있다
 */

/**
 * constants
 */
const MYPAGE_PATH = "/mypage";

const AVATAR_EXTENSIONS: Record<(typeof AVATAR_UPLOAD.types)[number], string> =
  {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

/**
 * types
 */
export type AvatarState = {
  message: string;
};

/**
 * actions
 */
export const updateMyProfile = async (formData: FormData) => {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  if (!name || name.length > PROFILE_LIMIT.name) {
    redirect(`${MYPAGE_PATH}?error=name#settings`);
  }
  if (phone === null) {
    redirect(`${MYPAGE_PATH}?error=phone#settings`);
  }
  if (birthDate && !isBirthDate(birthDate)) {
    redirect(`${MYPAGE_PATH}?error=birthDate#settings`);
  }
  await getDb().transaction(async tx => {
    await tx
      .update(profiles)
      .set({ name, phone, birthDate: birthDate || null, updatedAt: new Date() })
      .where(eq(profiles.id, user.id));
    await tx
      .update(boardPosts)
      .set({ authorName: name })
      .where(eq(boardPosts.authorId, user.id));
    await tx
      .update(boardComments)
      .set({ authorName: name })
      .where(eq(boardComments.authorId, user.id));
  });
  revalidatePath("/", "layout");
  redirect(`${MYPAGE_PATH}?saved=${Date.now()}#settings`);
};

export const updateMyAvatar = async (
  _state: AvatarState,
  formData: FormData,
): Promise<AvatarState> => {
  const user = await requireUser();
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { message: "사진을 골라 주세요." };
  }
  if (!isAvatarType(file.type)) {
    return { message: "JPG, PNG, WEBP, GIF 사진만 올릴 수 있어요." };
  }
  if (file.size > AVATAR_UPLOAD.maxSize) {
    return { message: "2MB 이하 사진만 올릴 수 있어요." };
  }
  const path = `${user.id}/${Date.now()}.${AVATAR_EXTENSIONS[file.type]}`;
  const storage = (await createServerSupabase()).storage.from(
    AVATAR_UPLOAD.bucket,
  );
  const uploaded = await storage.upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    upsert: false,
  });
  if (uploaded.error) {
    return { message: "사진을 올리지 못했어요. 잠시 후 다시 시도해 주세요." };
  }
  const previousPath = readAvatarPath(user.avatarUrl);
  await getDb()
    .update(profiles)
    .set({
      avatarUrl: storage.getPublicUrl(path).data.publicUrl,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));
  if (previousPath) {
    await storage.remove([previousPath]);
  }
  revalidatePath("/", "layout");
  return { message: "" };
};

export const removeMyAvatar = async () => {
  const user = await requireUser();
  const previousPath = readAvatarPath(user.avatarUrl);
  await getDb()
    .update(profiles)
    .set({ avatarUrl: null, updatedAt: new Date() })
    .where(eq(profiles.id, user.id));
  if (previousPath) {
    await (
      await createServerSupabase()
    ).storage
      .from(AVATAR_UPLOAD.bucket)
      .remove([previousPath]);
  }
  revalidatePath("/", "layout");
  redirect(MYPAGE_PATH);
};

export const deleteMyInquiry = async (formData: FormData) => {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (isUuid(id)) {
    await getDb()
      .delete(donationInquiries)
      .where(
        and(
          eq(donationInquiries.id, id),
          eq(donationInquiries.userId, user.id),
        ),
      );
  }
  revalidatePath(MYPAGE_PATH);
  redirect(`${MYPAGE_PATH}#inquiries`);
};

export const deleteMyBoardPost = async (formData: FormData) => {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (isUuid(id)) {
    await getDb()
      .delete(boardPosts)
      .where(and(eq(boardPosts.id, id), eq(boardPosts.authorId, user.id)));
  }
  revalidatePath(MYPAGE_PATH);
  revalidatePath("/board");
  redirect(`${MYPAGE_PATH}#posts`);
};

/**
 * 회원 탈퇴. 사진·문의·프로필을 지우고 Supabase Auth 계정(auth.users)도 DB에서 지운다. 게시글은 글쓴이 연결만 끊고 남는다.
 * 오너는 권한을 넘기기 전에는 탈퇴할 수 없다
 */
export const withdrawMe = async (formData: FormData) => {
  const user = await requireUser();
  if (formData.get("confirm") !== "on") {
    redirect(`${MYPAGE_PATH}?error=confirm#withdraw`);
  }
  if (user.role === "owner") {
    redirect(`${MYPAGE_PATH}?error=owner#withdraw`);
  }
  const storage = (await createServerSupabase()).storage.from(
    AVATAR_UPLOAD.bucket,
  );
  const files = await storage.list(user.id);
  if (files.data && files.data.length > 0) {
    await storage.remove(files.data.map(file => `${user.id}/${file.name}`));
  }
  const db = getDb();
  await db.transaction(async tx => {
    await tx
      .delete(donationInquiries)
      .where(eq(donationInquiries.userId, user.id));
    await tx.delete(adminMembers).where(eq(adminMembers.userId, user.id));
    await tx.delete(profiles).where(eq(profiles.id, user.id));
    await tx.execute(sql`delete from auth.users where id = ${user.id}`);
  });
  await signOut();
  revalidatePath("/", "layout");
  redirect("/");
};

/**
 * utils
 */
const requireUser = async () => {
  const user = await getSessionProfile();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(MYPAGE_PATH)}`);
  }
  return user;
};

/**
 * 숫자만 남겨 010-1234-5678 꼴로 맞춘다. 비우면 빈 값, 휴대전화 번호가 아니면 null
 */
const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (!/^01\d{8,9}$/.test(digits)) {
    return null;
  }
  return digits.length === 10
    ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const isBirthDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().startsWith(value) &&
    date.getUTCFullYear() >= 1900 &&
    date.getTime() <= Date.now()
  );
};

/**
 * 우리 avatars 버킷에 올린 사진이면 스토리지 경로, 소셜 계정 사진이면 null
 */
const readAvatarPath = (url: string | null) => {
  const marker = `/storage/v1/object/public/${AVATAR_UPLOAD.bucket}/`;
  const index = url?.indexOf(marker) ?? -1;
  if (!url || index < 0) {
    return null;
  }
  return url.slice(index + marker.length);
};
