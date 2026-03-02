// Design System — InpromptiFy Dashboard
// Dark theme — consistent with landing pages

export const ds = {
  // Layout
  page: "py-2 max-w-full",
  
  // Typography
  pageTitle: "text-[22px] font-semibold text-white tracking-[-0.02em]",
  pageSubtitle: "text-[13px] text-gray-400 mt-1 tracking-[0.01em]",
  sectionLabel: "text-[11px] font-medium text-gray-400 uppercase tracking-[0.08em]",
  sectionTitle: "text-[15px] font-semibold text-white tracking-[-0.01em]",
  tableHeader: "text-[11px] font-medium text-gray-500 uppercase tracking-[0.06em]",
  
  // Cards & Surfaces
  card: "bg-[#0C1120] border border-white/[0.06] rounded-lg transition-all duration-200",
  cardHover: "bg-[#0C1120] border border-white/[0.06] rounded-lg transition-all duration-200 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20",
  flatSection: "border-b border-white/[0.06] pb-6 mb-6",
  
  // Status dots
  statusDot: {
    active: "w-1.5 h-1.5 rounded-full bg-emerald-500",
    warning: "w-1.5 h-1.5 rounded-full bg-amber-400",
    error: "w-1.5 h-1.5 rounded-full bg-red-400",
    inactive: "w-1.5 h-1.5 rounded-full bg-gray-600",
    draft: "w-1.5 h-1.5 rounded-full bg-gray-600",
  },
  
  // Buttons
  btnPrimary: "inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-4 py-2 text-[13px] font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20",
  btnSecondary: "inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-md px-4 py-2 text-[13px] font-medium text-gray-400 transition-all duration-200",
  btnGhost: "inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-300 transition-colors duration-200",
  
  // Inputs
  input: "w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-all duration-200",
  inputLabel: "block text-[12px] font-medium text-gray-400 mb-1.5 tracking-[0.02em]",
  inputError: "text-[11px] text-red-400 mt-1",
  
  // Tables
  tableRow: "hover:bg-white/[0.02] transition-colors duration-150",
  tableCell: "px-5 py-3 text-[13px]",
  tableCellMuted: "px-5 py-3 text-[13px] text-gray-500",
  
  // Sidebar
  sidebarBg: "bg-[#0A0F1C]",
  sidebarItem: "flex items-center gap-2.5 px-3 py-2 text-[13px] transition-all duration-200 rounded-md",
  sidebarItemActive: "text-white bg-white/[0.06]",
  sidebarItemInactive: "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]",
  sidebarGroupLabel: "text-[10px] font-semibold text-gray-600 uppercase tracking-[0.1em] px-3 mb-1",
  
  // Badges & indicators
  scoreBadge: (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  },
  
  scoreRingColor: (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  },
  
  // Micro sparkline data
  fakeTrend: (current: number, length = 7): number[] => {
    const points: number[] = [];
    let val = current * 0.7;
    for (let i = 0; i < length; i++) {
      val += (current - val) * 0.3 + (Math.random() - 0.4) * current * 0.1;
      points.push(Math.round(Math.max(0, val)));
    }
    points[length - 1] = current;
    return points;
  },
} as const;

// SVG Sparkline component helper
export function sparklinePath(data: number[], width: number, height: number): string {
  if (data.length < 2) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  
  return data
    .map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height * 0.8 - height * 0.1;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

// Progress ring SVG helper
export function progressRing(percent: number, size: number, strokeWidth: number) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return { radius, circumference, offset, cx: size / 2, cy: size / 2 };
}
