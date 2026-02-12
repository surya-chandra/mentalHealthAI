import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ParticlesBg from "../components/ParticlesBg";
import GlassCard from "../components/GlassCard";
import bg from "../assets/bg.jpg";
import "./auth-premium.css";

export default function Dashboard() {
  const [mood, setMood] = useState("neutral");
  const [view, setView] = useState("home");
  const [message, setMessage] = useState("");
  const [journal, setJournal] = useState("");
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);

  const navigate = useNavigate();

  const moodToValue = {
    good: 3,
    neutral: 2,
    low: 1
  };

  const token = localStorage.getItem("token");

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    if (!token) return navigate("/");

    API.get("/protected", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMessage(res.data.msg))
      .catch(() => navigate("/"));

    loadEntries();
    loadStreak();
  }, []);

  const loadEntries = () => {
    API.get("/journal", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEntries(res.data))
      .catch(() => {});
  };

  const loadStreak = () => {
    API.get("/streak", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStreak(res.data.streak))
      .catch(() => {});
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ---------------- SAVE ENTRY ----------------
  const saveEntry = () => {
    if (!journal.trim()) return;

    API.post(
      "/journal",
      { text: journal, mood: mood },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setJournal("");
        setMood("neutral");
        loadEntries();
        loadStreak();
      })
      .catch(() => alert("Save failed"));
  };

  // ---------------- DELETE ENTRY ----------------
  const deleteEntry = index => {
    API.delete(`/journal/${index}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => loadEntries())
      .catch(() => alert("Delete failed"));
  };

  // ---------------- CHART DATA ----------------
  const chartData = entries
    .filter(e => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => ({
      date: e.date.slice(5),
      mood: moodToValue[e.mood] || 2
    }));

  // ---------------- INSIGHT ----------------
  const latestMood = entries.length
    ? entries[entries.length - 1].mood
    : "neutral";

  let insightMessage = "Keep going — small progress daily builds momentum.";

  if (latestMood === "low")
    insightMessage =
      "You seem tired. Take a breath, do one small task today.";
  if (latestMood === "neutral")
    insightMessage =
      "You’re stable. Consistency over perfection wins.";
  if (latestMood === "good")
    insightMessage =
      "Great energy. Use it for meaningful progress.";

  const consistencyScore = Math.min(100, streak * 10);

  return (
    <div className="auth-wrapper">
      <div
        className="auth-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="auth-overlay" />
      <ParticlesBg />

      {/* NAVBAR */}
      <Topbar setView={setView} logout={logout} />

      {/* MAIN */}
      <div style={{ padding: "80px 30px" }}>
        {/* HOME */}
        {view === "home" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20
              }}
            >
              <GlassCard>
                <h3>🔥 Consistency</h3>
                <p style={{ fontSize: 28 }}>{streak} Days</p>
              </GlassCard>

              <GlassCard>
                <h3>📊 Score</h3>
                <p style={{ fontSize: 28 }}>{consistencyScore}%</p>
              </GlassCard>

              <GlassCard>
                <h3>📓 Journals</h3>
                <p style={{ fontSize: 28 }}>{entries.length}</p>
              </GlassCard>
            </div>

            <GlassCard>
              <h3>🧠 Insight</h3>
              <p>{insightMessage}</p>
            </GlassCard>
          </div>
        )}

        {/* JOURNAL */}
        {view === "journal" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 20
            }}
          >
            {/* WRITE */}
            <GlassCard>
              <h2>Daily Journal</h2>

              <div style={{ marginTop: 8, display: "flex", gap: 10 }}>

                          {/* GOOD */}
                          <button
                            onClick={() => setMood("good")}
                            className="glass-btn"
                            style={{
                              padding: "10px 16px",
                              borderRadius: 12,
                              border: mood === "good" ? "1px solid #00ffa6" : "1px solid rgba(255,255,255,0.08)",
                              background:
                                mood === "good"
                                  ? "linear-gradient(145deg, rgba(0,255,170,0.25), rgba(0,180,120,0.18))"
                                  : "rgba(255,255,255,0.04)",
                              boxShadow:
                                mood === "good"
                                  ? "0 0 12px rgba(0,255,170,0.45), inset 0 0 8px rgba(0,255,170,0.2)"
                                  : "none",
                              transform: mood === "good" ? "scale(1.05)" : "scale(1)",
                              transition: "all 0.18s ease"
                            }}
                          >
                            🙂 Good
                          </button>


                          {/* NEUTRAL */}
                          <button
                            onClick={() => setMood("neutral")}
                            className="glass-btn"
                            style={{
                              padding: "10px 16px",
                              borderRadius: 12,
                              border: mood === "neutral" ? "1px solid #00c8ff" : "1px solid rgba(255,255,255,0.08)",
                              background:
                                mood === "neutral"
                                  ? "linear-gradient(145deg, rgba(0,200,255,0.25), rgba(0,140,220,0.18))"
                                  : "rgba(255,255,255,0.04)",
                              boxShadow:
                                mood === "neutral"
                                  ? "0 0 12px rgba(0,200,255,0.45), inset 0 0 8px rgba(0,200,255,0.2)"
                                  : "none",
                              transform: mood === "neutral" ? "scale(1.05)" : "scale(1)",
                              transition: "all 0.18s ease"
                            }}
                          >
                            😐 Neutral
                          </button>


                          {/* LOW */}
                          <button
                            onClick={() => setMood("low")}
                            className="glass-btn"
                            style={{
                              padding: "10px 16px",
                              borderRadius: 12,
                              border: mood === "low" ? "1px solid #ff5050" : "1px solid rgba(255,255,255,0.08)",
                              background:
                                mood === "low"
                                  ? "linear-gradient(145deg, rgba(255,80,80,0.25), rgba(200,40,40,0.18))"
                                  : "rgba(255,255,255,0.04)",
                              boxShadow:
                                mood === "low"
                                  ? "0 0 12px rgba(255,80,80,0.45), inset 0 0 8px rgba(255,80,80,0.2)"
                                  : "none",
                              transform: mood === "low" ? "scale(1.05)" : "scale(1)",
                              transition: "all 0.18s ease"
                            }}
                          >
                            😔 Low
                          </button>

                      </div>
              <textarea
                value={journal}
                onChange={e => setJournal(e.target.value)}
                placeholder="Write your thoughts..."
                style={{
                  width: "100%",
                  height: 140,
                  marginTop: 16,   
                  borderRadius: 12,
                  padding: 12,
                  border: "none",
                  outline: "none"
                  }}
                />
              <button
                className="glass-btn"
                style={{ width: "100%", marginTop: 10 }}
                onClick={saveEntry}
              >
                Save Entry
              </button>
            </GlassCard>

            {/* SAVED */}
            <GlassCard>
              <h3>Saved Entries</h3>

              {entries.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.05)",
                    padding: "8px 0"
                  }}
                >
                  <span>
                    {e.text} <small>({e.mood})</small>
                  </span>

                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteEntry(i)}
                  >
                    🗑
                  </span>
                </div>
              ))}
            </GlassCard>
          </div>
        )}

        {/* MOOD */}
        {view === "mood" && (
          <GlassCard>
            <h2>Mood Trend</h2>

            {chartData.length === 0 ? (
              <p>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="date" stroke="#aaa" />
                  <YAxis
                    domain={[1, 3]}
                    ticks={[1, 2, 3]}
                    stroke="#aaa"
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#00e5ff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
}
