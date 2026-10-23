"use server";

import { getDb, donationInquiries } from "@repo/db";
import { redirect } from "next/navigation";

const KINDS = new Set(["founding", "monthly", "once"]);

export const submitDonationInquiry = async (formData: FormData) => {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const amount = String(formData.get("amount") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const consent = formData.get("consent");
  if (!name || !email || !consent || !KINDS.has(kind)) {
    redirect("/donate");
  }
  await getDb().insert(donationInquiries).values({
    name,
    email,
    phone,
    kind,
    amount,
    message,
  });
  redirect("/donate?sent=1");
};
