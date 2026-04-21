"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  ShieldCheck,
  Calendar,
  Bot,
  Trophy,
  BarChart3,
  Menu,
  X,
  LogOut,
  Zap,
  Target,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot },
  { label: "Prompt Review", href: "/dashboard/review", icon: MessageSquare },
  { label: "Daily Challenge", href: "/daily", icon: Zap },
  { label: "Weekly Challenge", href: "/weekly", icon: Target },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { label: "My Results", href: "/dashboard/results", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminNavItems = [
  { label: "Questions", href: "/dashboard/admin/questions", icon: ShieldCheck },
  { label: "Bookings", href: "/dashboard/admin/bookings", icon: Calendar },
];

export function DashboardShell({
  children,
  orgName,
  userImageUrl,
  userName,
  hasOrg,
  isAdmin = false,
}: {
  children: React.ReactNode;
  orgName: string;
  userImageUrl: string;
  userName: string;
  hasOrg: boolean;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Org header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Inpromptify"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>



        {/* Nav */}
        <nav className="flex-1 space-y-1 px-2 py-3">
          {mainNavItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Admin separator — only shown to admins */}
          {isAdmin && (
            <>
              <div className="px-3 pt-4 pb-1">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-sidebar-border" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                    Admin
                  </span>
                  <div className="h-px flex-1 bg-sidebar-border" />
                </div>
              </div>

              {adminNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            {userImageUrl ? (
              <img
                src={userImageUrl}
                alt={userName}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <div className="size-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {userName}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-md p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="dashboard-theme flex flex-1 flex-col overflow-hidden bg-white">
        {/* Top bar (mobile) */}
        <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
          >
            <Menu className="size-5" />
          </button>
          <Image
            src="/logo.png"
            alt="Inpromptify"
            width={100}
            height={28}
            className="ml-3 h-7 w-auto"
          />
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-white p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
