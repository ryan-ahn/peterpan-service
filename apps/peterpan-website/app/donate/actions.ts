"use server";

import { redirect } from "next/navigation";

import { donationInquiries, getDb } from "@repo/db";
import { isDonationKindId } from "@repo/db/boards";

/**
 * actions
 */
export const submitDonationInquiry = async (formData: FormData) => {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const amount = String(formData.get("amount") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const hasConsent = Boolean(formData.get("consent"));
  if (!name || !email || !hasConsent || !isDonationKindId(kind)) {
    redirect("/donate");
  }
  await getDb()
    .insert(donationInquiries)
    .values({ name, email, phone, kind, amount, message });
  redirect("/donate?sent=1");
};
