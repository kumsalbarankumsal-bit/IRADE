/* Web Audio ile küçük, yumuşak geri bildirim sesleri (dosya yok). */
let ctx = null;
function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function tone(freq, start, dur, type = "sine", gain = 0.12) {
  const a = ac();
  if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime + start);
  g.gain.setValueAtTime(0.0001, a.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, a.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + start);
  o.stop(a.currentTime + start + dur + 0.05);
}
export const SFX = {
  correct() { tone(880, 0, 0.12); tone(1318.5, 0.08, 0.18); },
  wrong() { tone(196, 0, 0.22, "triangle", 0.14); tone(155.6, 0.1, 0.25, "triangle", 0.1); },
  flip() { tone(1200, 0, 0.05, "sine", 0.05); },
  level() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.22)); },
  tick() { tone(1500, 0, 0.03, "square", 0.03); },
};
export function play(name, on) {
  if (!on) return;
  try { SFX[name] && SFX[name](); } catch (e) { /* ses yok */ }
}
