export default function Sidebar({ setView, logout }) {
  return (
    <div style={{
      width: 220,
      backdropFilter: "blur(30px)",
      background: "rgba(255,255,255,0.05)",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      padding: 20,
      color: "white"
    }}>
      <h3 style={{ marginBottom: 20 }}>MindAI</h3>

      <p onClick={() => setView("home")} style={item}>🏠 Dashboard</p>
      <p onClick={() => setView("journal")} style={item}>📓 Journal</p>
      <p onClick={() => setView("mood")} style={item}>🧠 Mood</p>

      <p onClick={logout} style={{ ...item, marginTop: 30, color: "#ff6b6b" }}>
        Logout
      </p>
    </div>
  );
}

const item = {
  cursor: "pointer",
  padding: "8px 0",
  opacity: 0.9
};
