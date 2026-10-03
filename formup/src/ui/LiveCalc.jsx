/* Canlı formül: kartın C/CT alanından kaydırıcılar ve sayıları yerine konmuş formül */
import React, { useMemo, useState } from "react";
import { compileCalc, fillTemplate } from "../data/v2/parse.js";
import { Slider, LiveTex, nf, tn } from "../labs/kit.jsx";

const GREEK = /^(theta|alpha|beta|gamma|mu|sigma|lambda|phi|Delta|delta|omega)$/;
const varTex = (name) => (GREEK.test(name) ? "\\" + name : name.replace(/^([A-Za-z]+)_?([0-9]+)$/, "$1_$2"));

export default function LiveCalc({ card, onTouch }) {
  const fn = useMemo(() => { try { return compileCalc(card.c); } catch (e) { return null; } }, [card.id]); // eslint-disable-line
  const [vals, setVals] = useState(() => Object.fromEntries(card.c.vars.map((v) => [v.name, v.def])));
  if (!fn) return null;
  let res;
  try { res = fn(vals); } catch (e) { res = NaN; }
  const fmt = (x) => (typeof x === "boolean" ? (x ? "\\checkmark" : "\\times") : Number.isFinite(x) ? tn(x, 3) : "\\text{?}");
  const tex = fillTemplate(card.ct, vals, res, fmt);
  const decimals = (step) => (step >= 1 ? 0 : step >= 0.1 ? 1 : 2);
  return (
    <div className="lab">
      <LiveTex tex={tex} />
      {card.c.vars.map((v) => (
        <Slider key={v.name} tex={varTex(v.name)} value={vals[v.name]} min={v.min} max={v.max} step={v.step}
          fmt={(x) => nf(x, decimals(v.step))}
          onChange={(x) => { setVals((o) => ({ ...o, [v.name]: x })); onTouch && onTouch(); }} />
      ))}
    </div>
  );
}
