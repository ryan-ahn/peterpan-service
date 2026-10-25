import AdminFrame from "@components/adminFrame";
import { requireAdmin } from "@lib/adminSession";

export const dynamic = "force-dynamic";

export default async function ManageLayout({ children }: LayoutProps<"/">) {
  const self = await requireAdmin();
  return <AdminFrame self={self}>{children}</AdminFrame>;
}
