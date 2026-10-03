import React, { useState } from "react";
import { LabShell, Slider, Plot, Curve, Point, Readout, LiveTex, tn, nf } from "./kit.jsx";
export default function Demo() {
  const [a, setA] = useState(1);
  return (
    <LabShell title="Deneme" titleEn="Demo" hint="Kaydırıcıyı oynat." hintEn="Move the slider.">
      <Plot xMin={-4} xMax={4} yMin={-2} yMax={8}><Curve f={(x) => a * x * x} /><Point x={1} y={a} label="(1, a)" /></Plot>
      <Slider tex="a" label="katsayı" labelEn="coefficient" value={a} min={-2} max={3} step={0.1} onChange={setA} />
      <LiveTex tex={`y=${tn(a)}x^2`} />
      <Readout items={[{ label: "Tepe", labelEn: "Vertex", tex: "(0,0)" }, { label: "a", value: nf(a) }]} />
    </LabShell>
  );
}
