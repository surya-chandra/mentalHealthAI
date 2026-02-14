import SearchFilterBar from "../components/SearchFilterBar";
import AnalyticsWidget from "../components/AnalyticsWidget";
import QuickActions from "../components/QuickActions";
import Notifications from "../components/Notifications";
import EditableEntry from "../components/EditableEntry";
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
  const [timeLeft, setTimeLeft] = useState(1500); // 25 min
  const [running, setRunning] = useState(false);
  const [goalDone, setGoalDone] = useState(false);
  const [mood, setMood] = useState("neutral");
  const [view, setView] = useState("home");
  const [message, setMessage] = useState("");
  const [journal, setJournal] = useState("");
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
const [filterMood, setFilterMood] = useState("");
const [notifications, setNotifications] = useState([
  "Stay consistent today 💪",
  "Write at least 1 journal entry",
  "Your streak is growing 🔥"
]);

  const navigate = useNavigate();

  const moodToValue = {
    good: 3,
    neutral: 2,
    low: 1
  };
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


  const token = localStorage.getItem("token");

  // ---------------- LOAD DATA ----------------
useEffect(() => {
  if (!token) return navigate("/");

  API.get("/protected", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => setMessage(res.data.msg))
    .catch(() => navigate("/"));

  // SAFE interval
  const interval = setInterval(() => {
    reloadData();
  }, 15000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (!running) return;

  const t = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(t);
        setRunning(false);
        return 1500;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(t);
}, [running]);


  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

    // ---------- Reload Dashboard Data ----------
const reloadData = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  API.get("/journal", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setEntries([...res.data]));

  API.get("/streak", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setStreak(res.data.streak));
};


  // ---------------- SAVE ENTRY ----------------
const saveEntry = () => {
  if (!journal.trim()) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  API.post(
    "/journal",
    { text: journal, mood: mood },
    { headers: { Authorization: `Bearer ${token}` } }
  )
    .then(() => {
      setJournal("");
      setMood("neutral");
      reloadData();
    })
    .catch(() => {});
};


// ---------------- DELETE ENTRY ----------------
const deleteEntry = (index) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  API.delete(`/journal/${index}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      reloadData();
    })
    .catch(() => {});
};

  // ---------------- CHART DATA ----------------
  // -------- Burnout Detection --------
// ---------------- CHART DATA ----------------
const chartData = entries
  .filter(e => e.date)
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .map(e => ({
    date: e.date.slice(5),
    mood: moodToValue[e.mood] || 2
  }));

// -------- Burnout Detection --------
const moodTrend = chartData.map(d => d.mood);
let burnoutWarning = null;

if (moodTrend.length >= 3) {
  const last3 = moodTrend.slice(-3);
  if (last3[2] < last3[1] && last3[1] < last3[0]) {
    burnoutWarning =
      "⚠ Your mood is declining for 3 days. Take rest, reset mind, avoid overload.";
  }
}


    // ---------- Latest Mood ----------
const latestMood = entries.length
  ? entries[entries.length - 1].mood
  : "neutral";

  // ---------------- INSIGHT ----------------
  let insightMessage = "";

  if (streak === 0) {
    insightMessage = "Start small. One entry today can restart your discipline.";
  }
  else if (latestMood === "low" && streak < 3) {
    insightMessage =
      "You seem mentally tired and inconsistent. Don’t chase motivation — build small habits.";
  }
  else if (latestMood === "low") {
    insightMessage =
      "You are pushing through stress. Reduce pressure and focus on clarity, not speed.";
  }
  else if (latestMood === "neutral") {
    insightMessage =
      "You are stable. Consistency matters more than intensity right now.";
  }
  else if (latestMood === "good" && streak >= 5) {
    insightMessage =
      "Great rhythm. You’re building control over your mind — protect this streak.";
  }
  else {
    insightMessage =
      "You’re progressing. Small daily effort is reshaping your discipline.";
  }


  const consistencyScore = (() => {
  if (entries.length === 0) return 0;

  let score = 0;

  // +40 for streak
  score += Math.min(40, streak * 8);

  // +30 for regular journaling
  const last7 = entries.slice(-7);
  score += Math.min(30, last7.length * 4);

  // +30 based on mood stability
  const moodMap = { good: 3, neutral: 2, low: 1 };
  const avgMood =
    last7.reduce((s, e) => s + (moodMap[e.mood] || 2), 0) /
    (last7.length || 1);

  score += avgMood * 10;

  return Math.min(100, Math.round(score));
})();


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
          {/* ===== INSERTED : SEARCH + FILTER ===== */}
          <SearchFilterBar
            onSearch={(q) => setSearchQuery(q)}
            onFilter={(m) => setFilterMood(m)}
          />

          {/* ===== INSERTED : WIDGETS ROW ===== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20
            }}
          >
            <GlassCard>
              <AnalyticsWidget entries={entries} streak={streak} />
            </GlassCard>

            <GlassCard>
              <QuickActions
                onAdd={() => setView("journal")}
                onRefresh={reloadData}
              />
            </GlassCard>

            <GlassCard>
              <Notifications items={notifications} />
            </GlassCard>
          </div>
          {/* ===== END INSERTED ===== */}


          {/* ===== YOUR ORIGINAL CODE (UNCHANGED) ===== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20
            }}
          >
            <GlassCard>
              {/* animation: "fadeUp 0.4s ease" */}
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
          {burnoutWarning && (
            <GlassCard>
              <h3>⚠ Mood Alert</h3>
              <p>{burnoutWarning}</p>
            </GlassCard>
          )}


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

            <GlassCard>
                <h3>⏱ Focus Session</h3>

                <h2>
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </h2>

                <button
                  className="glass-btn"
                  onClick={() => setRunning(!running)}
                >
                  {running ? "Pause" : "Start Focus"}
                </button>
              </GlassCard>

            {/* WRITE */}


             <GlassCard>
            <h3>🎯 Daily Goal</h3>
            <p>Complete your main task today</p>

            <button
              className="glass-btn"
              onClick={() => setGoalDone(!goalDone)}
            >
              {goalDone ? "✅ Completed" : "Mark as Done"}
            </button>
          </GlassCard>

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
              <h3>📜 Journal Timeline</h3>
                    <p className="label">Your emotional and mental journey</p>

                    <div className="journal-timeline">
                      {entries.map((e, i) => (
                        <div key={i} className="timeline-entry">
                          <div className="timeline-dot" />

                          <div className="timeline-content">
                            <div className="timeline-header">
                              <span className="timeline-mood">
                                {e.mood === "good" ? "🙂" : e.mood === "neutral" ? "😐" : "😔"}
                              </span>

                              <span className="timeline-date">
                                {e.date?.slice(0, 10) || "Today"}
                              </span>
                            </div>

                            <p className="timeline-text">{e.text}</p>
                          </div>

                          <span
                            className="timeline-delete"
                            onClick={() => deleteEntry(i)}
                          >
                            🗑
                          </span>
                        </div>
                      ))}
                    </div>

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
