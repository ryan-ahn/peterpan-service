import { requireOwner } from "@lib/adminSession";

export default async function PermissionsLayout({
  children,
}: LayoutProps<"/permissions">) {
  await requireOwner();
  return children;
}
