import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Send } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function AssessmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">
            Create and manage AI proficiency assessments for your team.
          </p>
        </div>
        <Link
          href="/dashboard/assessments"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus className="mr-1.5 size-4" />
          New Assessment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Badge variant="default">All</Badge>
        <Badge variant="outline">Pending</Badge>
        <Badge variant="outline">In Progress</Badge>
        <Badge variant="outline">Completed</Badge>
      </div>

      {/* Table / Empty state */}
      <Card>
        <CardHeader>
          <CardTitle>All Assessments</CardTitle>
          <CardDescription>
            Track candidate invitations, progress, and results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <Send className="size-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">
              No assessments created yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Send an assessment link to a candidate to start measuring their AI
              proficiency. Results will appear here.
            </p>
            <Link
              href="/dashboard/assessments"
              className={cn(buttonVariants({ size: "sm" }), "mt-6")}
            >
              <Plus className="mr-1.5 size-4" />
              Create Assessment
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
