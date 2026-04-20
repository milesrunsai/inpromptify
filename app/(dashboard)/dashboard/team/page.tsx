import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage team members and their roles.
          </p>
        </div>
        <Link
          href="/dashboard/team"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <UserPlus className="mr-1.5 size-4" />
          Invite Member
        </Link>
      </div>

      {/* Roles legend */}
      <div className="flex gap-2">
        <Badge variant="default">Admin</Badge>
        <Badge variant="outline">Member</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            People in your organization who can create and view assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <Users className="size-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No team members yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create an organization in Clerk to start inviting team members.
              Admins can manage assessments and billing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
