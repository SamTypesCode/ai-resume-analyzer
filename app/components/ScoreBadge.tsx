interface ScoreBadgeProps {
  score: number; // The score value to display
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeClass = "";

  // Decide badge color based on score
  if (score > 70) {
    // High score so green
    badgeClass = "bg-emerald-100 text-emerald-700";
  } else if (score > 49) {
    // Medium score so orange
    badgeClass = "bg-orange-100 text-orange-500";
  } else {
    // Low score so red
    badgeClass = "bg-red-100 text-red-500";
  }

  return (
    // Badge container with dynamic color classes
    <div className={`px-3 py-1 rounded-full ${badgeClass}`}>
      {/* Display rounded score as percentage */}
      <p className="text-xs font-medium">{Math.round(score)}%</p>
    </div>
  );
};

export default ScoreBadge;
