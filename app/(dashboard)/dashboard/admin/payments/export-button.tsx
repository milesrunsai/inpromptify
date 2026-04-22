"use client";

import { Download } from "lucide-react";

interface PaymentData {
  id: string;
  userEmail: string;
  userName: string | null;
  plan: string;
  amount: string;
  status: string;
  date: string;
}

export function ExportButton({ payments }: { payments: PaymentData[] }) {
  const handleExportCSV = () => {
    if (payments.length === 0) return;
    
    const csvData = payments.map(payment => ({
      "User Email": payment.userEmail,
      "User Name": payment.userName || "",
      Plan: payment.plan,
      Amount: payment.amount,
      Status: payment.status,
      Date: new Date(payment.date).toLocaleDateString(),
    }));
    
    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(","),
      ...csvData.map(row => 
        headers.map(h => 
          `"${String(row[h as keyof typeof row] ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExportCSV}
      disabled={payments.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
    >
      <Download className="size-4" />
      Export for Tax
    </button>
  );
}
