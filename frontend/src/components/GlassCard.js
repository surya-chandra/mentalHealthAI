export default function GlassCard({ children }) {
  return (
    <div style={{
      width: 420,
      padding: 35,
      borderRadius: 22,
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(30px) saturate(140%)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 15px 50px rgba(0,0,0,0.5)",
      color: "#e9eef7",
      textAlign: "center",
      position: "relative",
      zIndex: 1
    }}>
      {children}
    </div>
  );
}
