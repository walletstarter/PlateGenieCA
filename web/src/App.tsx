import React, { useMemo, useState } from "react";
import { apiSuggest, apiCheck } from "./api";
import type { Availability } from "./types";

type Row = { plate: string; availability?: Availability; checking?: boolean; };

function useLocalFavorites() {
  const [favs, setFavs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("favs") || "[]"); } catch { return []; }
  });
  const add = (p: string) => {
    setFavs(prev => {
      const next = Array.from(new Set([p, ...prev])).slice(0, 100);
      localStorage.setItem("favs", JSON.stringify(next));
      return next;
    });
  };
  const remove = (p: string) => {
    setFavs(prev => {
      const next = prev.filter(x => x !== p);
      localStorage.setItem("favs", JSON.stringify(next));
      return next;
    });
  };
  return { favs, add, remove };
}

export default function App() {
  const [seed, setSeed] = useState("");
  const [allowNumbers, setAllowNumbers] = useState(true);
  const [min, setMin] = useState(2);
  const [max, setMax] = useState(7);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const { favs, add: addFav, remove: rmFav } = useLocalFavorites();

  const canGen = seed.trim().length > 0 && !busy;
  const orderedFavs = useMemo(() => favs, [favs]);

  const generate = async () => {
    setBusy(true);
    try {
      const suggestions = await apiSuggest({ seed, constraints: { min, max, allowNumbers }, count: 12 });
      setRows(suggestions.map(s => ({ plate: s })));
    } finally {
      setBusy(false);
    }
  };

  const checkOne = async (plate: string) => {
    setRows(prev => prev.map(r => r.plate === plate ? { ...r, checking: true } : r));
    try {
      const availability = await apiCheck(plate);
      setRows(prev => prev.map(r => r.plate === plate ? { ...r, availability, checking: false } : r));
    } catch {
      setRows(prev => prev.map(r => r.plate === plate ? { ...r, availability: "UNKNOWN", checking: false } : r));
    }
  };

  const badge = (a?: Availability) => {
    if (!a) return <span className="badge gray">unchecked</span>;
    const cls = a === "AVAILABLE" ? "badge green" : a === "TAKEN" ? "badge red" : "badge gray";
    return <span className={cls}>{a.toLowerCase()}</span>;
  };

  return (
    <div className="container">
      <img src="/CA-Plate-Genie.gif" alt="Driving genie" className="hero" />
      <h1>CA Plate Genie</h1>
      <p><small className="hint">Generate ideas and test availability for California personalized plates.</small></p>

      <div className="row">
        <input value={seed} onChange={e => setSeed(e.target.value)} placeholder="Seed (e.g., 'fast', 'ai', 'duncan')" />
        <select value={min} onChange={e => setMin(Number(e.target.value))}>
          {[2,3,4,5,6,7].map(n => <option key={n} value={n}>min {n}</option>)}
        </select>
        <select value={max} onChange={e => setMax(Number(e.target.value))}>
          {[2,3,4,5,6,7].map(n => <option key={n} value={n}>max {n}</option>)}
        </select>
        <label><input type="checkbox" checked={allowNumbers} onChange={e => setAllowNumbers(e.target.checked)} /> allow numbers</label>
        <button disabled={!canGen} onClick={generate}>{busy ? "Generating..." : "Generate"}</button>
      </div>

      <div className="grid">
        {rows.map(r => (
          <div className="card" key={r.plate}>
            <div style={{ fontSize: 22, letterSpacing: 2 }}>{r.plate}</div>
            <div>{badge(r.availability)} {r.checking ? "checking..." : ""}</div>
            <div className="row" style={{ justifyContent: "center" }}>
              <button onClick={() => checkOne(r.plate)}>Check</button>
              {favs.includes(r.plate)
                ? <button onClick={() => rmFav(r.plate)}>★ Saved</button>
                : <button onClick={() => addFav(r.plate)}>☆ Save</button>}
              <a href="https://www.google.com/search?q=California+DMV+Personalized+Plates+Order" target="_blank" rel="noreferrer">
                <button>Order ▸</button>
              </a>
            </div>
          </div>
        ))}
      </div>

      <hr />
      <h2>Favorites</h2>
      <div className="favs row" style={{ gap: 6 }}>
        {orderedFavs.length === 0 && <small className="hint">No favorites saved yet.</small>}
        {orderedFavs.map(p => (
          <span key={p} className="badge gray">{p} <button onClick={() => rmFav(p)}>×</button></span>
        ))}
      </div>
    </div>
  );
}
