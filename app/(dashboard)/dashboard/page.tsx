import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  ClipboardList,
  TrendingUp,
  Users,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { ScoreChart } from "@/components/dashboard/score-chart";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    IN_PROGRESS: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    PENDING: "bg-white/[0.06] text-white/50 border-white/[0.08]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status] ?? styles.PENDING
      )}
    >
      {status === "IN_PROGRESS" ? "In Progress" : status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default async function DashboardOverviewPage() {
  const { orgId } = await auth();
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const firstName = user.firstName ?? "there";

  // If no org, show a lightweight prompt
  if (!orgId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {firstName}!
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create an Organization</CardTitle>
            <CardDescription>
              You need an organization to start creating assessments and managing
              your team. Create one from the user menu in the sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="mb-4 size-12 text-muted-foreground/40" />
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Organizations let you invite team members, run assessments, and
                track AI proficiency scores across your company.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch org from DB
  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: {
      subscriptions: { take: 1, orderBy: { id: "desc" } },
      members: true,
    },
  });

  // Fetch assessment data
  const [totalAssessments, completedAssessments, recentAssessments] =
    await Promise.all([
      prisma.assessment.count({
        where: { orgId: org?.id ?? "" },
      }),
      prisma.assessment.findMany({
        where: { orgId: org?.id ?? "", status: "COMPLETED", score: { not: null } },
        select: { score: true },
      }),
      prisma.assessment.findMany({
        where: { orgId: org?.id ?? "" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          candidateEmail: true,
          score: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const avgScore =
    completedAssessments.length > 0
      ? Math.round(
          completedAssessments.reduce((sum, a) => sum + (a.score ?? 0), 0) /
            completedAssessments.length
        )
      : null;

  const teamCount = org?.members.length ?? 0;
  const subscription = org?.subscriptions[0];
  const credits = subscription?.credits ?? 5;
  const tier = subscription?.tier ?? "FREE";

  // Build score distribution buckets
  const buckets = [
    { range: "0-20", min: 0, max: 20, count: 0 },
    { range: "21-40", min: 21, max: 40, count: 0 },
    { range: "41-60", min: 41, max: 60, count: 0 },
    { range: "61-80", min: 61, max: 80, count: 0 },
    { range: "81-100", min: 81, max: 100, count: 0 },
  ];
  for (const a of completedAssessments) {
    const s = a.score ?? 0;
    const bucket = buckets.find((b) => s >= b.min && s <= b.max);
    if (bucket) bucket.count++;
  }
  const chartData = buckets.map(({ range, count }) => ({ range, count }));

  const stats = [
    {
      title: "Total Assessments",
      value: totalAssessments.toString(),
      description: "All time",
      icon: ClipboardList,
    },
    {
      title: "Average Score",
      value: avgScore !== null ? `${avgScore}%` : "\u2014",
      description: "Across completed assessments",
      icon: TrendingUp,
    },
    {
      title: "Team Members",
      value: teamCount.toString(),
      description: "Active users",
      icon: Users,
    },
    {
      title: "Credits",
      value: credits.toString(),
      description: tier === "FREE" ? "Free tier" : `${tier.charAt(0) + tier.slice(1).toLowerCase()} plan`,
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {firstName}!
          </p>
        </div>
        <Link
          href="/dashboard/assessments"
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          New Assessment
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>
            Distribution of assessment scores across all completed assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedAssessments.length > 0 ? (
            <ScoreChart data={chartData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="mb-4 size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Score distribution will appear here once assessments are
                completed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>
            The latest assessment results from your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentAssessments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Candidate</th>
                    <th className="pb-3 pr-4 font-medium">Score</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssessments.map((assessment) => (
                    <tr
                      key={assessment.id}
                      className="border-b border-white/[0.04] last:border-0"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-medium">
                          {assessment.candidateEmail}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {assessment.score !== null ? (
                          <span className="font-semibold tabular-nums">
                            {assessment.score}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={assessment.status} />
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(assessment.createdAt).toLocaleDateString(
                          "en-AU",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="mb-4 size-12 text-muted-foreground/40" />
              <h3 className="text-lg font-medium">No assessments yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first assessment to start measuring AI proficiency
                across your team.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
