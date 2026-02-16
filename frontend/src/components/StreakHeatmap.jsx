import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function StreakHeatmap({ entries }) {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 60);

  // Convert entries → heatmap format
  const values = entries.map((e) => ({
    date: e.date?.slice(0, 10),
    count: 1
  }));

  return (
    <div>
      <h3>📅 Consistency Heatmap</h3>
      <p className="label">Your daily journaling activity</p>

      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value) return "heat-empty";
          return "heat-level";
        }}
      />
    </div>
  );
}
