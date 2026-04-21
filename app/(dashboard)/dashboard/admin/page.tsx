import { prisma } from "@/lib/db";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  Activity, 
  CreditCard,
  UserCheck,
  MessageSquare,
  Trophy,
  ShieldCheck,
  Calendar
} from "lucide-react";

async function getAdminStats() {
  const [
    totalUsers,
    totalAssessments,
    todayQuizAttempts,
    recentSignups,
    totalSubscriptions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.assessment.count(),
    prisma.dailyQuizAttempt.count({
      where: {
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      },
    }),
    prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.subscription.count(),
  ]);

  return {
    totalUsers,
    totalAssessments,
    todayQuizAttempts,
    recentSignups,
    revenue: totalSubscriptions > 0 ? totalSubscriptions * 29 : 0, // Placeholder calculation
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      className: "text-blue-600",
    },
    {
      title: "Total Assessments",
      value: stats.totalAssessments,
      icon: FileText,
      className: "text-green-600",
    },
    {
      title: "Daily Active (Today)",
      value: stats.todayQuizAttempts,
      icon: Activity,
      className: "text-orange-600",
    },
    {
      title: "Revenue (Estimate)",
      value: `$${stats.revenue}`,
      icon: CreditCard,
      className: "text-purple-600",
    },
  ];

  const adminPages = [
    {
      title: "Users Management",
      description: "View, search, and manage all users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Payments & Subscriptions",
      description: "Monitor Stripe payments and billing",
      href: "/dashboard/admin/payments",
      icon: CreditCard,
    },
    {
      title: "AI Conversations",
      description: "Review AI chat logs and conversations",
      href: "/dashboard/admin/conversations",
      icon: MessageSquare,
    },
    {
      title: "Leaderboard Controls",
      description: "Manage daily quiz leaderboard entries",
      href: "/dashboard/admin/leaderboard",
      icon: Trophy,
    },
    {
      title: "Question Bank",
      description: "Review and approve assessment questions",
      href: "/dashboard/admin/questions",
      icon: ShieldCheck,
    },
    {
      title: "Demo Bookings",
      description: "View and manage demo bookings",
      href: "/dashboard/admin/bookings",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Overview and quick access to all admin functions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="border border-gray-200 rounded-xl p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`size-8 ${stat.className}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Signups */}
      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Signups</h2>
          <p className="text-sm text-gray-600 mt-1">Last 20 users to join</p>
        </div>
        <div className="divide-y divide-gray-100">
          {stats.recentSignups.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserCheck className="size-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          {stats.recentSignups.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No users registered yet.
            </div>
          )}
        </div>
      </div>

      {/* Admin Pages Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="border border-gray-200 rounded-xl p-6 bg-white hover:border-orange-300 hover:bg-orange-50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <page.icon className="size-5 text-orange-600 group-hover:text-orange-700" />
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-900">
                  {page.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 group-hover:text-orange-700">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}