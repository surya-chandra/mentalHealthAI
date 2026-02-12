export default function GlassCard({ children }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, rgba(30,35,55,0.88), rgba(15,20,40,0.96))",
        borderRadius: 18,
        padding: 24,
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 10px 32px rgba(0,0,0,0.35)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        position: "relative",
        overflow: "hidden"
      }}
      className="glass-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 16px 42px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,255,200,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 10px 32px rgba(0,0,0,0.35)";
      }}
    >
      {/* subtle glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 10%, rgba(0,255,200,0.08), transparent 60%)",
          pointerEvents: "none"
        }}
      />

      {children}
    </div>
  );
}
