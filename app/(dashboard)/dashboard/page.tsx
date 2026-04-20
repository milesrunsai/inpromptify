import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ClipboardList,
  TrendingUp,
  Users,
  CreditCard,
} from "lucide-react";

const stats = [
  {
    title: "Total Assessments",
    value: "0",
    description: "All time",
    icon: ClipboardList,
  },
  {
    title: "Average Score",
    value: "—",
    description: "Across all candidates",
    icon: TrendingUp,
  },
  {
    title: "Team Members",
    value: "0",
    description: "Active users",
    icon: Users,
  },
  {
    title: "Credits Remaining",
    value: "5",
    description: "Free tier",
    icon: CreditCard,
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to InpromptiFy. Manage your AI proficiency assessments.
        </p>
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

      {/* Recent assessments table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>
            Assessment results from your team will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="text-lg font-medium">No assessments yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first assessment to start measuring AI proficiency
              across your team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
