"use client";

import { useState } from "react";

const notifications = [
  {
    id: "assessment_completed",
    label: "Assessment Completed",
    description: "Receive an email when a candidate completes an assessment.",
  },
  {
    id: "team_member_joined",
    label: "Team Member Joined",
    description:
      "Get notified when a new team member accepts an invitation.",
  },
  {
    id: "weekly_digest",
    label: "Weekly Digest",
    description:
      "A summary of assessment activity and team performance each week.",
  },
];

export function NotificationPreferences() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    assessment_completed: true,
    team_member_joined: true,
    weekly_digest: false,
  });

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={enabled[item.id]}
            onClick={() => toggle(item.id)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-white/[0.08] transition-colors ${
              enabled[item.id] ? "bg-orange-500" : "bg-white/[0.06]"
            }`}
          >
            <span
              className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${
                enabled[item.id] ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
            />
          </button>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Notification preferences are saved automatically.
      </p>
    </div>
  );
}
