// components/QuickActions.js
export default function QuickActions({ onAdd, onRefresh }) {
  return (
    <div>
      <h3>⚡ Quick Actions</h3>
      <button className="glass-btn" onClick={onAdd}>
        Add Journal
      </button>
      <button className="glass-btn" onClick={onRefresh}>
        Refresh Data
      </button>
    </div>
  );
}
