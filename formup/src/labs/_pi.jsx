import React from "react";
import Pi, { OUTFITS } from "../ui/Pi.jsx";
export default function PiDemo() {
  const moods = ["idle", "happy", "sad", "think", "sleep", "party"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {moods.map((m) => <div key={m} style={{ textAlign: "center", fontSize: 11 }}><Pi mood={m} size={96} /><div>{m}</div></div>)}
      {OUTFITS.map((o) => <div key={o.id} style={{ textAlign: "center", fontSize: 11 }}><Pi outfit={o.id} size={96} /><div>{o.id}</div></div>)}
    </div>
  );
}
