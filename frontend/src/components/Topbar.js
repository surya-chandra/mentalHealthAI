export default function Topbar({ setView, logout }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        backdropFilter: "blur(12px)",
        background: "rgba(8,12,25,0.65)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999
      }}
    >
      {/* INNER CONTAINER (fixes stretch) */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px"
        }}
      >
        {/* LOGO → HOME */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            letterSpacing: 0.5
          }}
          onClick={() => setView("home")}
        >
          MindAI
        </div>

        {/* NAV */}
        <div style={{ display: "flex", gap: 26, fontSize: 14 }}>
          <span
            style={{ cursor: "pointer", opacity: 0.85 }}
            onClick={() => setView("home")}
          >
            Dashboard
          </span>

          <span
            style={{ cursor: "pointer", opacity: 0.85 }}
            onClick={() => setView("journal")}
          >
            Journal
          </span>

          <span
            style={{ cursor: "pointer", opacity: 0.85 }}
            onClick={() => setView("mood")}
          >
            Mood
          </span>
        </div>

        {/* RIGHT */}
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
