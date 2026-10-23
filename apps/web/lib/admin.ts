import { redirect } from "next/navigation";

import { getSessionProfile } from "@/lib/auth";

export const requireAdmin = async () => {
  const user = await getSessionProfile();
  if (!user) {
    redirect("/login?next=/admin");
  }
  if (user.role !== "admin") {
    redirect("/admin/forbidden");
  }
  return user;
};
