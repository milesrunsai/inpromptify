import { redirect } from "next/navigation";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  const org = await getUserOrg(user.id);

  return (
    <DashboardShell
      orgName={org?.slug ?? "Personal"}
      userImageUrl={user.imageUrl ?? ""}
      userName={user.name ?? user.email}
      hasOrg={!!org}
      isAdmin={isAdmin(user.email)}
    >
      {children}
    </DashboardShell>
  );
}
