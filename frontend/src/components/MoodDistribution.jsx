import { useState, useMemo, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MOODS = {
  good: { label: "Happy", emoji: "😀", color: "#00ffa6", desc: "Positive and uplifted" },
  low: { label: "Sad", emoji: "😢", color: "#ff5c5c", desc: "Low energy or down" },
  angry: { label: "Angry", emoji: "😡", color: "#ff8a3d", desc: "Frustrated or tense" },
  calm: { label: "Relaxed", emoji: "😌", color: "#4cc9f0", desc: "Peaceful and calm" },
  excited: { label: "Excited", emoji: "🤩", color: "#ffd166", desc: "Energetic and motivated" },
  neutral: { label: "Neutral", emoji: "😐", color: "#9aa5b1", desc: "Stable mood" }
};

export default function MoodDistribution({ entries }) {
  const [view, setView] = useState("pie");
  const [range, setRange] = useState("monthly");
  const chartRef = useRef();

  // -------- Filter entries by date --------
  const filtered = useMemo(() => {
    const now = new Date();
    return entries.filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date);
      const diff = (now - d) / (1000 * 60 * 60 * 24);

      if (range === "daily") return diff <= 1;
      if (range === "weekly") return diff <= 7;
      return diff <= 30;
    });
  }, [entries, range]);

  // -------- Count moods --------
  const data = useMemo(() => {
    const counts = {};
    Object.keys(MOODS).forEach(m => (counts[m] = 0));

    filtered.forEach(e => {
      if (counts[e.mood] !== undefined) counts[e.mood]++;
    });

    return Object.keys(counts).map(key => ({
      key,
      name: `${MOODS[key].emoji} ${MOODS[key].label}`,
      value: counts[key],
      color: MOODS[key].color,
      desc: MOODS[key].desc
    })).filter(d => d.value > 0);
  }, [filtered]);

  // -------- Export PNG --------
  const exportPNG = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "mood-chart.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  // -------- Export PDF --------
  const exportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
    pdf.save("mood-chart.pdf");
  };

  return (
    <div className="mood-chart-container">
      <h3>📊 Mood Distribution Chart</h3>

      {/* Controls */}
      <div ref={chartRef} className="mood-chart-wrapper" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => setView("pie")}>Pie</button>
        <button onClick={() => setView("bar")}>Bar</button>

        <select onChange={(e) => setRange(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button onClick={exportPNG}>Export PNG</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>

      {/* Chart */}
      <div ref={chartRef} style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          {view === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
                label
                animationDuration={400}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n, p) => [`${v}`, p.payload.desc]} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v, n, p) => [`${v}`, p.payload.desc]} />
              <Bar dataKey="value" animationDuration={400}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

