import { requireSuper } from "@lib/adminSession";

export default async function PermissionsLayout({
  children,
}: LayoutProps<"/permissions">) {
  await requireSuper();
  return children;
}
