export type CertTier = "expert" | "proficient" | "foundational" | null;

export function getCertTier(score: number): CertTier {
  if (score >= 80) return "expert";
  if (score >= 65) return "proficient";
  if (score >= 50) return "foundational";
  return null;
}

const TIER_CONFIG = {
  expert: {
    label: "Expert",
    color: "text-amber-300",
    border: "border-amber-400/40",
    bg: "bg-amber-400/[0.06]",
    glow: "shadow-amber-500/10",
    ring: "ring-amber-400/20",
    iconColor: "#fbbf24",
    desc: "Top-tier AI proficiency. Demonstrates advanced prompt engineering, optimization, and strategic AI usage.",
  },
  proficient: {
    label: "Proficient",
    color: "text-gray-300",
    border: "border-gray-300/30",
    bg: "bg-gray-300/[0.04]",
    glow: "shadow-gray-400/10",
    ring: "ring-gray-300/15",
    iconColor: "#d1d5db",
    desc: "Strong AI proficiency. Demonstrates effective prompting, clear iteration strategy, and efficient usage.",
  },
  foundational: {
    label: "Foundational",
    color: "text-orange-400",
    border: "border-orange-400/30",
    bg: "bg-orange-400/[0.04]",
    glow: "shadow-orange-500/10",
    ring: "ring-orange-400/15",
    iconColor: "#cd7f32",
    desc: "Foundational AI proficiency. Understands core prompting concepts and can produce adequate results.",
  },
};

function ShieldIcon({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L3 7V12C3 17.25 6.75 21.15 12 22C17.25 21.15 21 17.25 21 12V7L12 2Z"
        fill={color}
        fillOpacity={0.15}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CertBadge({
  score,
  compact = false,
  showDesc = false,
}: {
  score: number;
  compact?: boolean;
  showDesc?: boolean;
}) {
  const tier = getCertTier(score);
  if (!tier) return null;

  const config = TIER_CONFIG[tier];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 border rounded-md px-2.5 py-1 ${config.border} ${config.bg}`}>
        <ShieldIcon color={config.iconColor} size={16} />
        <span className={`text-[12px] font-semibold ${config.color}`}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`border rounded-xl p-6 ring-1 shadow-lg ${config.border} ${config.bg} ${config.glow} ${config.ring}`}>
      <div className="flex items-center gap-4">
        <ShieldIcon color={config.iconColor} size={48} />
        <div>
          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">InpromptiFy Certified</p>
          <h3 className={`text-xl font-bold ${config.color}`}>{config.label}</h3>
          <p className="text-sm text-gray-500">PromptScore: {score}/100</p>
        </div>
      </div>
      {showDesc && (
        <p className="text-[13px] text-gray-500 mt-4 leading-relaxed">{config.desc}</p>
      )}
    </div>
  );
}
