import { prisma } from "@/lib/db";
import { AlertCircle } from "lucide-react";
import { ExportButton } from "./export-button";

export const dynamic = "force-dynamic";

interface PaymentData {
  id: string;
  userEmail: string;
  userName: string | null;
  plan: string;
  amount: string;
  status: string;
  date: string;
}

async function getPaymentData(): Promise<PaymentData[]> {
  try {
    // Check if Subscription model exists and get payment data
    const subscriptions = await prisma.subscription.findMany({
      include: {
        org: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { id: "desc" }, // Use id since createdAt doesn't exist
      take: 100,
    });

    return subscriptions.map((sub) => {
      const primaryUser = sub.org.members[0]?.user; // Get first member as primary
      return {
        id: sub.id,
        userEmail: primaryUser?.email || "Unknown",
        userName: primaryUser?.name || null,
        plan: sub.tier,
        amount: getPlanAmount(sub.tier),
        status: sub.status,
        date: sub.org.createdAt?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return [];
  }
}

function getPlanAmount(tier: string): string {
  switch (tier) {
    case "STARTER":
      return "$29";
    case "BUSINESS":
      return "$99";
    case "ENTERPRISE":
      return "$299";
    default:
      return "$0";
  }
}

export default async function AdminPaymentsPage() {
  const payments = await getPaymentData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Payments & Subscriptions
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor Stripe payments and subscription data
          </p>
        </div>
        <ExportButton payments={payments} />
      </div>

      {/* Stripe Status Notice */}
      <div className="border border-amber-200 rounded-xl bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-amber-600" />
          <div>
            <h3 className="font-medium text-amber-900">Stripe Integration Status</h3>
            <p className="text-sm text-amber-700 mt-1">
              This shows subscription data from the database. For complete payment history, 
              check your Stripe dashboard directly.
            </p>
          </div>
        </div>
      </div>

      {/* Date Range Filter - Placeholder for future enhancement */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <h3 className="font-medium text-gray-900 mb-3">Filter by Date Range</h3>
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              disabled
            />
          </div>
          <button
            disabled
            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md text-sm cursor-not-allowed"
          >
            Apply Filter
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Date filtering will be implemented when payment webhook logging is added.
        </p>
      </div>

      {/* Payments Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="font-medium">No payment data available</p>
                      <p className="text-sm mt-1">
                        Payments will appear here once Stripe webhooks are configured and subscriptions are created.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {payment.userName || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {payment.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        payment.plan === "ENTERPRISE" 
                          ? "bg-purple-100 text-purple-800"
                          : payment.plan === "BUSINESS"
                          ? "bg-blue-100 text-blue-800"
                          : payment.plan === "STARTER"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {payment.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {payment.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : payment.status === "past_due"
                          ? "bg-red-100 text-red-800"
                          : payment.status === "canceled"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {new Date(payment.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      {payments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-600">Total Subscriptions</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {payments.length}
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-600">Active Subscriptions</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {payments.filter(p => p.status === "active").length}
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-600">Monthly Revenue (Est.)</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              ${payments.reduce((sum, p) => {
                const amount = parseInt(p.amount.replace("$", "")) || 0;
                return p.status === "active" ? sum + amount : sum;
              }, 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}