"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#10b981"; // green-500
  if (score >= 70) return "#f59e0b"; // amber-500
  if (score >= 55) return "#ef4444"; // red-500
  return "#6b7280"; // gray-500
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Exceptional";
  if (score >= 70) return "Proficient";
  if (score >= 55) return "Developing";
  return "Needs Improvement";
}

export function ScoreRing({ score, size = 200 }: ScoreRingProps) {
  const radius = (size - 40) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900">{score}</div>
          <div className="text-lg text-gray-500">/100</div>
        </div>
      </div>
      
      {/* Score label */}
      <div className="mt-4 text-center">
        <div 
          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
}