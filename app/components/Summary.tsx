import React from "react";
import ScoreGauge from "./ScoreGauge";
import { scoreColor } from "~/lib/utils";

// Component to display the summary score
const Summary = ({ score }: { score: number }) => {
  // Get a color based on the score value
  const textColor = scoreColor(score);

  return (
    <div>
      {/* Title */}
      <h5 className="text-center font-medium text-2xl mb-4 mt-6">Your Score</h5>

      {/* Gauge chart showing score */}
      <ScoreGauge score={score} />

      {/* Numeric score with dynamic color */}
      <h5
        className="text-2xl font-semibold text-center mt-4 mb-0"
        style={{ color: textColor }}
      >
        {score}/100
      </h5>
    </div>
  );
};

export default Summary;
