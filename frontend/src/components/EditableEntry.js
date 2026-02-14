// components/EditableEntry.js
import { useState } from "react";

export default function EditableEntry({ entry, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(entry.text);

  return (
    <div style={{ padding: "6px 0" }}>
      {editing ? (
        <>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="auth-input"
          />
          <button
            className="glass-btn"
            onClick={() => {
              onSave(text);
              setEditing(false);
            }}
          >
            Save
          </button>
        </>
      ) : (
        <span onDoubleClick={() => setEditing(true)}>
          {entry.text} <small>({entry.mood})</small>
        </span>
      )}
    </div>
  );
}
