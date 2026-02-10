import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ParticlesBg from "../components/ParticlesBg";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import bg from "../assets/bg.jpg";
import "./auth-premium.css";

export default function Dashboard() {
  const [view, setView] = useState("home");
  const [message, setMessage] = useState("");
  const [journal, setJournal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    API.get("/protected", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMessage(res.data.msg))
      .catch(() => navigate("/"));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="auth-wrapper">

      <div className="auth-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="auth-overlay" />
      <ParticlesBg />

      <div style={{ display: "flex", width: "100%", zIndex: 2 }}>

        {/* Sidebar */}
        <Sidebar setView={setView} logout={logout} />

        {/* Content */}
        <div style={{ flex: 1, padding: 30 }}>

          {view === "home" && (
            <GlassCard>
              <h2>Welcome</h2>
              <p>{message}</p>

              <div style={{ marginTop: 15 }}>
                <p>🔥 Streak: 4 days</p>
                <p>📓 Journals: 6</p>
                <p>🧠 Mood: Stable</p>
              </div>
            </GlassCard>
          )}

          {view === "journal" && (
            <GlassCard>
              <h2>Daily Journal</h2>

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

              <button className="glass-btn" style={{ marginTop: 10 }}>
                Save Entry
              </button>
            </GlassCard>
          )}

          {view === "mood" && (
            <GlassCard>
              <h2>Mood Tracker</h2>
              <p>🙂 😊 😐 😔 😣</p>
              <p style={{ opacity: 0.7 }}>
                (Chart integration coming next)
              </p>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
}
