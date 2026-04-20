import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { orgId, orgSlug } = await auth();
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  return (
    <DashboardShell
      orgName={orgSlug ?? "Personal"}
      userImageUrl={user.imageUrl}
      userName={user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "User"}
      hasOrg={!!orgId}
    >
      {children}
    </DashboardShell>
  );
}
