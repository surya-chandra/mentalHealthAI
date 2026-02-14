// components/SearchFilterBar.js
import { useState } from "react";

export default function SearchFilterBar({ onSearch, onFilter }) {
  const [query, setQuery] = useState("");

  return (
    <div className="searchbar-wrapper">
  <input
    type="text"
    placeholder="Search your thoughts, moods, or entries..."
    className="searchbar-input"
    onChange={(e) => onSearch(e.target.value)}
  />

  <select
    className="searchbar-filter"
    onChange={(e) => onFilter(e.target.value)}
  >
    <option value="">All</option>
    <option value="good">Good</option>
    <option value="neutral">Neutral</option>
    <option value="low">Low</option>
  </select>
</div>

  );
}
