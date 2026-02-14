// components/AnalyticsWidget.js
export default function AnalyticsWidget({ entries, streak }) {
  const total = entries.length;
  const good = entries.filter(e => e.mood === "good").length;

  return (
    <div>
      <h3>📈 Analytics</h3>
      <p>Total Entries: {total}</p>
      <p>Positive Mood %: {total ? Math.round((good / total) * 100) : 0}%</p>
      <p>Current Streak: {streak}</p>
    </div>
  );
}
