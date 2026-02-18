export function analyzeMind({ entries, streak, focusMinutes }) {
  if (!entries || entries.length === 0) {
    return {
      insight: "Start journaling to unlock AI insights.",
      warning: null,
      suggestion: "Write one small entry today."
    };
  }

  const moodMap = { good: 3, neutral: 2, low: 1 };

  const moods = entries.map(e => moodMap[e.mood] || 2);
  const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;

  const last3 = moods.slice(-3);

  let warning = null;
  if (last3.length === 3 && last3[2] < last3[1] && last3[1] < last3[0]) {
    warning = "Your mood is declining. Slow down and rest.";
  }

  let insight = "";
  if (avgMood >= 2.6) insight = "You are emotionally stable and positive.";
  else if (avgMood >= 2) insight = "Your mood is balanced but not optimal.";
  else insight = "You seem mentally tired and low.";

  let suggestion = "";

  if (streak === 0)
    suggestion = "Start small. Write one entry today.";
  else if (streak < 3)
    suggestion = "Build consistency before intensity.";
  else if (focusMinutes < 20)
    suggestion = "Try a short 25 min focus session.";
  else
    suggestion = "Maintain rhythm. Avoid burnout.";

  return { insight, warning, suggestion };
}
