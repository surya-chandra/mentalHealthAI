// components/Notifications.js
export default function Notifications({ items }) {
  return (
    <div>
      <h3>🔔 Notifications</h3>
      {items.length === 0 && <p>No alerts</p>}
      {items.map((n, i) => (
        <div key={i} style={{ padding: "6px 0", opacity: 0.8 }}>
          {n}
        </div>
      ))}
    </div>
  );
}
