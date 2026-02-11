import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ParticlesBg from "../components/ParticlesBg";
import Sidebar from "../components/Sidebar";
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

  const moodToValue = {
    good: 3,
    neutral: 2,
    low: 1
  };

  // 👇 MOVED OUTSIDE JSX (NO OTHER CHANGE)
  console.log("Entries:", entries);

  const chartData = entries
    .filter(e => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => ({
      date: e.date.slice(5),
      mood: moodToValue[e.mood] || 2
    }));

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    API.get("/protected", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMessage(res.data.msg))
      .catch(() => navigate("/"));

    API.get("/journal", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEntries(res.data))
      .catch(() => {});

    API.get("/streak", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStreak(res.data.streak))
      .catch(() => {});
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const saveEntry = () => {
    if (!journal.trim()) return alert("Write something first");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired, please login again");
      return navigate("/");
    }

    API.post("/journal",
      { text: journal, mood: mood },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      setJournal("");
      setMood("neutral");

      API.get("/journal")
        .then(res => {
          console.log("Loaded entries:", res.data);
          setEntries(res.data);
        })
        .catch(err => console.log("Journal load error", err));

      API.get("/streak", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setStreak(res.data.streak));
    })
    .catch(() => alert("Failed to save"));
  };

  // ---------- Emotional Insight ----------
  const latestMood = entries.length
    ? entries[entries.length - 1].mood
    : "neutral";

  let insightMessage = "You’re doing fine. Keep small progress going.";

  if (latestMood === "low") {
    insightMessage =
      "You seem mentally tired. Try taking a small step today — even 10 minutes counts.";
  } else if (latestMood === "neutral") {
    insightMessage =
      "You're stable. Consistency over perfection will move you forward.";
  } else if (latestMood === "good") {
    insightMessage =
      "Great energy today. Use this momentum to do something meaningful.";
  }

  const consistencyScore = Math.min(100, streak * 10);

  return (
    <div className="auth-wrapper">

      <div className="auth-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="auth-overlay" />
      <ParticlesBg />

      <div style={{ display: "flex", width: "100%", zIndex: 2 }}>

        <Sidebar setView={setView} logout={logout} />

        <div style={{ flex: 1, padding: 30 }}>

          {/* HOME */}
          {view === "home" && (
            <div style={{ display: "grid", gap: 20 }}>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>

                <GlassCard>
                  <h3>🔥 Consistency</h3>
                  <p style={{ fontSize: 28 }}>{streak} Days</p>
                  <small>Small steps daily → Big change</small>
                </GlassCard>

                <GlassCard>
                  <h3>📊 Score</h3>
                  <p style={{ fontSize: 28 }}>{consistencyScore}%</p>
                  <small>Your discipline level</small>
                </GlassCard>

                <GlassCard>
                  <h3>📓 Journals</h3>
                  <p style={{ fontSize: 28 }}>{entries.length}</p>
                  <small>Reflection builds awareness</small>
                </GlassCard>

              </div>

              <GlassCard>
                <h3>🧠 Insight</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6 }}>
                  {insightMessage}
                </p>
              </GlassCard>

              <GlassCard>
                <h3>🌱 Recovery</h3>
                {latestMood === "low" ? (
                  <p>You might be under stress. Slow down, breathe, and focus on one small task today.</p>
                ) : latestMood === "neutral" ? (
                  <p>You are stable. Build consistency — even small progress matters.</p>
                ) : (
                  <p>You are doing well. Maintain this rhythm and protect your energy.</p>
                )}
              </GlassCard>

            </div>
          )}

          {/* JOURNAL */}
          {view === "journal" && (
            <GlassCard>
              <h2>Daily Journal</h2>

              <div style={{ marginBottom: 10 }}>
                <b>Select Mood:</b>

                <div style={{ marginTop: 5 }}>
                  <button onClick={() => setMood("good")} className="glass-btn">🙂 Good</button>
                  <button onClick={() => setMood("neutral")} className="glass-btn" style={{ marginLeft: 6 }}>😐 Neutral</button>
                  <button onClick={() => setMood("low")} className="glass-btn" style={{ marginLeft: 6 }}>😔 Low</button>
                </div>
              </div>

              <textarea
                value={journal}
                onChange={e => setJournal(e.target.value)}
                placeholder="Write your thoughts..."
                style={{
                  width: "100%",
                  height: 120,
                  marginTop: 10,
                  borderRadius: 10,
                  padding: 10,
                  border: "none",
                  outline: "none"
                }}
              />

              <button
                className="glass-btn"
                style={{ marginTop: 10 }}
                onClick={saveEntry}
              >
                Save Entry
              </button>

              {/* 👇 ADDED ONLY THIS BLOCK (SHOW JOURNALS) */}
              <div style={{ marginTop: 20 }}>
                <h4>Saved Entries</h4>

                {entries.length === 0 && <p>No entries yet</p>}

                {entries.map((e, i) => (
                  <p key={i} style={{ opacity: 0.85 }}>
                    • {e.text} &nbsp;
                    <small>({e.mood})</small>
                  </p>
                ))}
              </div>
            </GlassCard>
          )}

          {/* MOOD */}
          {view === "mood" && (
            <GlassCard>
              <h2>Mood Trend</h2>

              {chartData.length === 0 ? (
                <p>No mood data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="date" stroke="#ccc" />
                    <YAxis domain={[1, 3]} ticks={[1, 2, 3]} stroke="#ccc" />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#00e5ff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              <div style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>
                1 = Low 😔 &nbsp;&nbsp; 2 = Neutral 😐 &nbsp;&nbsp; 3 = Good 🙂
              </div>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
}
