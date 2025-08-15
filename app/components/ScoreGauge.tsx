import React from "react";
import { scoreColor } from "~/lib/utils";

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: number; // default 130
  strokeWidth?: number; // default 16
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 130,
  strokeWidth = 16,
}) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);

  // Determine color based on score
  const strokeColor = scoreColor(clampedScore);

  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // half-circle length
  const offset = circumference - (circumference * clampedScore) / 100;

  return (
    <div className="relative h-[65px] w-[130px] mx-auto">
      {/* Bottom line */}
      <div className="z-10 absolute bottom-0 left-1/2 -translate-x-1/2 w-[140px] h-[1px] bg-neutral-700"></div>
      {/* Center dot */}
      <div className="z-10 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[6px] h-[6px] rounded-full bg-neutral-700"></div>

      <svg width={size} height={size / 2} className="relative">
        {/* Background semi-circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e5e5" // gray-400 like original border
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          transform={`rotate(-180 ${size / 2} ${size / 2})`}
        />
        {/* Colored semi-circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-180 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
          }}
        />
      </svg>
    </div>
  );
};

export default ScoreGauge;
