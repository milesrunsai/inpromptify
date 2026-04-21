import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ApiKeys, type ApiKeyData } from "@/components/dashboard/api-keys";
import { NotificationPreferences } from "@/components/dashboard/notification-preferences";

const tierBadgeStyles: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-600 border-gray-200",
  STARTER: "bg-orange-50 text-orange-700 border-orange-200",
  BUSINESS: "bg-blue-50 text-blue-700 border-blue-200",
  ENTERPRISE: "bg-purple-50 text-purple-700 border-purple-200",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const userOrg = await getUserOrg(user.id);

  let org = null;
  let subscription = null;
  let apiKeys: ApiKeyData[] = [];
  let tier = "FREE";
  let credits = 5;
  let assessmentCount = 0;

  if (userOrg) {
    org = await prisma.organization.findUnique({
      where: { id: userOrg.id },
      include: {
        subscriptions: { take: 1, orderBy: { id: "desc" } },
      },
    });

    if (org) {
      subscription = org.subscriptions[0] ?? null;
      tier = subscription?.tier ?? "FREE";
      credits = subscription?.credits ?? 5;

      const [dbKeys, count] = await Promise.all([
        prisma.apiKey.findMany({
          where: { orgId: org.id, isActive: true },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            prefix: true,
            createdAt: true,
            lastUsed: true,
          },
        }),
        prisma.assessment.count({
          where: { orgId: org.id },
        }),
      ]);

      assessmentCount = count;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiKeys = (dbKeys as any[]).map((k: { id: string; name: string; prefix: string; createdAt: Date; lastUsed: Date | null }) => ({
        id: k.id,
        name: k.name,
        prefix: k.prefix,
        createdAt: k.createdAt.toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        lastUsed: k.lastUsed
          ? k.lastUsed.toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : null,
      }));
    }
  }

  const tierLabel = tier.charAt(0) + tier.slice(1).toLowerCase();
  const canCreateApiKeys = tier !== "FREE";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization, billing, and API access.
        </p>
      </div>

      {/* Billing & Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Billing & Plan</CardTitle>
          <CardDescription>
            Your current subscription plan and usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Current Plan</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                tierBadgeStyles[tier] ?? tierBadgeStyles.FREE
              )}
            >
              {tierLabel}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Credits</p>
              <p className="text-2xl font-bold tabular-nums">{credits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assessments</p>
              <p className="text-2xl font-bold tabular-nums">
                {assessmentCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Billing Period</p>
              <p className="text-2xl font-bold">
                {subscription ? "Monthly" : "\u2014"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Upgrade Plan
          </Link>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1.5"
            )}
          >
            Manage Billing
            <ExternalLink className="size-3" />
          </Link>
        </CardFooter>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage API keys for integrating Inpromptify into your workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeys keys={apiKeys} canCreate={canCreateApiKeys} />
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose which email notifications you would like to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationPreferences />
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>
            Manage your organization settings and membership.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {org ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Organization
              </span>
              <span className="text-sm font-medium">{org.name}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No organization found. Contact your admin to get
              started.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Organization management (members, roles) is available through the
            Team page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
