import React, { useMemo, useState } from "react";
import { apiSuggest, apiCheck } from "./api";
import type { Availability } from "./types";
import { COPY } from "./copy";

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
    if (!a) return <span className="badge gray">{COPY.STATUS.unchecked}</span>;
    const cls = a === "AVAILABLE" ? "badge green" : a === "TAKEN" ? "badge red" : "badge gray";
    const txt =
      a === "AVAILABLE"
        ? COPY.STATUS.available
        : a === "TAKEN"
        ? COPY.STATUS.taken
        : a === "INVALID"
        ? COPY.STATUS.invalid
        : COPY.STATUS.unknown;
    return <span className={cls}>{txt}</span>;
  };

  return (
    <div className="container">
      <img
        src={`${import.meta.env.BASE_URL}CA-Plate-Genie.gif`}
        alt="Driving genie"
        className="hero"
      />
      <h1>{COPY.HERO.headline}</h1>
      <p><small className="hint">{COPY.HERO.subhead}</small></p>

      <div className="row">
        <input
          value={seed}
          onChange={e => setSeed(e.target.value)}
          placeholder={COPY.INPUT.placeholder}
          title={COPY.TOOLTIPS.seed}
        />
        <label title={COPY.TOOLTIPS.min}>
          {COPY.INPUT.minLabel}
          <select value={min} onChange={e => setMin(Number(e.target.value))}>
            {[2, 3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label title={COPY.TOOLTIPS.max}>
          {COPY.INPUT.maxLabel}
          <select value={max} onChange={e => setMax(Number(e.target.value))}>
            {[2, 3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label title={COPY.TOOLTIPS.allowNumbers}>
          <input
            type="checkbox"
            checked={allowNumbers}
            onChange={e => setAllowNumbers(e.target.checked)}
          />
          {" "}
          {COPY.INPUT.allowNumbers}
        </label>
        <button disabled={!canGen} onClick={generate}>
          {busy ? COPY.INPUT.generating : COPY.INPUT.generate}
        </button>
      </div>

      {rows.length === 0 && !busy && (
        <p>
          <small className="hint">{COPY.EMPTY.suggestions}</small>
        </p>
      )}
      <div className="grid">
        {rows.map(r => (
          <div className="card" key={r.plate}>
            <div style={{ fontSize: 22, letterSpacing: 2 }}>{r.plate}</div>
            <div>
              {badge(r.availability)} {r.checking ? "checking..." : ""}
            </div>
            <div className="row" style={{ justifyContent: "center" }}>
              <button onClick={() => checkOne(r.plate)} title={COPY.TOOLTIPS.check}>
                {COPY.ACTIONS.check}
              </button>
              {favs.includes(r.plate) ? (
                <button onClick={() => rmFav(r.plate)} title={COPY.TOOLTIPS.save}>
                  {COPY.ACTIONS.saved}
                </button>
              ) : (
                <button onClick={() => addFav(r.plate)} title={COPY.TOOLTIPS.save}>
                  {COPY.ACTIONS.save}
                </button>
              )}
              <a href={COPY.LINKS.dmvOrder} target="_blank" rel="noreferrer">
                <button title={COPY.TOOLTIPS.order}>{COPY.ACTIONS.order}</button>
              </a>
            </div>
          </div>
        ))}
      </div>

      <hr />
      <h2>Favorites</h2>
      <div className="favs row" style={{ gap: 6 }}>
        {orderedFavs.length === 0 && (
          <small className="hint">{COPY.EMPTY.favorites}</small>
        )}
        {orderedFavs.map(p => (
          <span key={p} className="badge gray">
            {p} <button onClick={() => rmFav(p)}>×</button>
          </span>
        ))}
      </div>
      <hr />
      <h2>{COPY.HOW_IT_WORKS.title}</h2>
      <ol>
        {COPY.HOW_IT_WORKS.steps.map(s => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <h2>{COPY.TIPS.title}</h2>
      <ul>
        {COPY.TIPS.bullets.map(b => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <h2>{COPY.RULES.title}</h2>
      <ul>
        {COPY.RULES.bullets.map(b => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <p>
        <small className="hint">{COPY.HINTS.keyboard}</small>
      </p>
      <h2>{COPY.FAQ.title}</h2>
      <div>
        {COPY.FAQ.items.map(i => (
          <details key={i.q}>
            <summary>{i.q}</summary>
            <p>{i.a}</p>
          </details>
        ))}
      </div>
      <hr />
      <footer>
        <p>
          <small>{COPY.FOOTER.line1}</small>
        </p>
        <p>
          <small>{COPY.FOOTER.line2}</small>
        </p>
        <p>
          <small>{COPY.FOOTER.copyright}</small>
        </p>
      </footer>
    </div>
  );
}
