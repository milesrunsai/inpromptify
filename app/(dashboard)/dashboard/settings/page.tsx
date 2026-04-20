import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization, billing, and API access.
        </p>
      </div>

      {/* Billing card */}
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
            <Badge variant="secondary">Free</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Credits Used</p>
              <p className="text-2xl font-bold">0 / 5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assessments</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Billing Period</p>
              <p className="text-2xl font-bold">—</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Upgrade Plan
          </Link>
        </CardFooter>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Manage API keys for integrating InpromptiFy into your workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              API keys are available on Starter plans and above. Upgrade your
              plan to get started with the API.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>
            Organization settings are managed through Clerk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Visit your Clerk dashboard to manage organization name, members, and
            SSO settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
