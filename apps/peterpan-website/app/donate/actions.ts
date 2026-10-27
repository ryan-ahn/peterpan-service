"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionProfile } from "@repo/auth/session";
import { donationInquiries, getDb } from "@repo/db";
import { isDonationFormKind } from "@repo/db/boards";

/**
 * actions
 */
/**
 * 공식 계좌로 보낸 후원을 알린다. 로그인했으면 회원에 연결해 마이페이지 후원 내역에 보인다
 */
export const submitDonationInquiry = async (formData: FormData) => {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const amount = String(formData.get("amount") ?? "").trim();
  const depositorName = String(formData.get("depositorName") ?? "").trim();
  const wallName = String(formData.get("wallName") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const hasConsent = Boolean(formData.get("consent"));
  if (!name || !email || !hasConsent || !isDonationFormKind(kind)) {
    redirect("/donate#notice");
  }
  const user = await getSessionProfile();
  await getDb()
    .insert(donationInquiries)
    .values({
      userId: user?.id ?? null,
      name,
      email,
      phone,
      kind,
      amount,
      depositorName,
      wallName,
      message,
    });
  revalidatePath("/mypage");
  redirect("/donate?sent=1#notice");
};
