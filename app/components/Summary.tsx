import React from "react";
import ScoreGauge from "./ScoreGauge";
import { scoreColor } from "~/lib/utils";

const Summary = ({ score }: { score: number }) => {
  const textColor = scoreColor(score);

  return (
    <div>
      <h5 className="text-center text-2xl mb-4 mt-6">Your Score</h5>

      <ScoreGauge score={score} />
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
