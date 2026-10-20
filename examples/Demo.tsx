"use client";

import { useMemo, useState } from "react";
import { SAMPLE_POLICY, expectedAttempts, plainLanguage, rateTable, summarize, type PityPolicy } from "./pity";

function readNumber(value: string, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function Demo() {
  const [baseRate, setBaseRate] = useState(String(SAMPLE_POLICY.baseRate));
  const [softStart, setSoftStart] = useState(String(SAMPLE_POLICY.softStart));
  const [step, setStep] = useState(String(SAMPLE_POLICY.step));
  const [cap, setCap] = useState(String(SAMPLE_POLICY.cap));
  const [hard, setHard] = useState(String(SAMPLE_POLICY.hardGuaranteeAt));

  const parsed = useMemo(() => {
    const policy: PityPolicy = {
      baseRate: readNumber(baseRate, SAMPLE_POLICY.baseRate),
      softStart: Math.round(readNumber(softStart, SAMPLE_POLICY.softStart)),
      step: readNumber(step, SAMPLE_POLICY.step),
      cap: readNumber(cap, SAMPLE_POLICY.cap),
      hardGuaranteeAt: Math.round(readNumber(hard, SAMPLE_POLICY.hardGuaranteeAt)),
    };
    try {
      return {
        ok: true as const,
        lines: plainLanguage(policy),
        rows: rateTable(policy).filter((_, i) => i % 5 === 0 || i === policy.hardGuaranteeAt),
        exact: expectedAttempts(policy),
        sim: summarize(policy, 20261020, 400),
      };
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : "Invalid policy" };
    }
  }, [baseRate, softStart, step, cap, hard]);

  return (
    <main className="wrap">
      <p className="kicker">educational-reference · no chain calls</p>
      <h1>Pity rates, written down</h1>
      <p className="lede">
        Soft pity raises the chance after a streak of misses. A hard guarantee forces the next attempt.
        Both rules have to live in the contract that draws the number. This page only does the arithmetic.
      </p>

      <div className="row">
        <label>
          Base rate (0–1)
          <input value={baseRate} onChange={(e) => setBaseRate(e.target.value)} inputMode="decimal" />
        </label>
        <label>
          Soft start (misses)
          <input value={softStart} onChange={(e) => setSoftStart(e.target.value)} inputMode="numeric" />
        </label>
        <label>
          Step added per extra miss
          <input value={step} onChange={(e) => setStep(e.target.value)} inputMode="decimal" />
        </label>
        <label>
          Soft cap (0–1)
          <input value={cap} onChange={(e) => setCap(e.target.value)} inputMode="decimal" />
        </label>
        <label>
          Hard guarantee after this many misses
          <input value={hard} onChange={(e) => setHard(e.target.value)} inputMode="numeric" />
        </label>
      </div>

      {parsed.ok ? (
        <>
          <h2>What a player should be able to read</h2>
          <ul className="plain">
            {parsed.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="summary">
            Exact mean attempts until the first hit: <strong>{parsed.exact.toFixed(2)}</strong>. A seeded
            run of {parsed.sim.runs} tries averaged <strong>{parsed.sim.meanAttempts.toFixed(2)}</strong> and
            forced the guarantee on <strong>{(parsed.sim.forcedShare * 100).toFixed(1)}%</strong> of them.
            Same seed, same numbers. Not a live drop.
          </p>
          <table>
            <caption>Rate after this many misses. Forced is a word, not only a color.</caption>
            <thead>
              <tr>
                <th>Misses before</th>
                <th>Rate</th>
                <th>Forced</th>
              </tr>
            </thead>
            <tbody>
              {parsed.rows.map((row) => (
                <tr key={row.misses}>
                  <td>{row.misses}</td>
                  <td>{(row.rate * 100).toFixed(2)}%</td>
                  <td>{row.forced ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p role="alert">{parsed.error}</p>
      )}
    </main>
  );
}
