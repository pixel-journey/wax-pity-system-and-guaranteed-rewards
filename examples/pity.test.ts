import { describe, expect, it } from "vitest";
import {
  SAMPLE_POLICY,
  expectedAttempts,
  hitProbabilityAtAttempt,
  plainLanguage,
  rateAfterMisses,
  rollUntilHit,
  summarize,
} from "./pity";

const sample = SAMPLE_POLICY;

describe("rateAfterMisses", () => {
  it("stays at the base rate before soft pity", () => {
    expect(rateAfterMisses(sample, 0)).toBe(0.05);
    expect(rateAfterMisses(sample, 9)).toBe(0.05);
  });

  it("steps up and then stops at the cap", () => {
    expect(rateAfterMisses(sample, 10)).toBeCloseTo(0.07);
    expect(rateAfterMisses(sample, 30)).toBe(0.25);
  });

  it("forces the attempt once the hard guarantee is reached", () => {
    expect(rateAfterMisses(sample, 40)).toBe(1);
    expect(rateAfterMisses(sample, 41)).toBe(1);
  });

  it("rejects a guarantee that can never be reached after soft pity", () => {
    expect(() => rateAfterMisses({ ...sample, hardGuaranteeAt: 10 }, 0)).toThrow(/hardGuaranteeAt/);
  });
});

describe("expectation", () => {
  it("matches a plain geometric when pity never starts", () => {
    const policy = { baseRate: 0.25, softStart: 1000, step: 0, cap: 0.25, hardGuaranteeAt: 5000 };
    expect(expectedAttempts(policy)).toBeCloseTo(4, 2);
  });

  it("is exactly the guarantee attempt when every earlier rate is zero", () => {
    const policy = { baseRate: 0, softStart: 0, step: 0, cap: 0, hardGuaranteeAt: 2 };
    expect(rateAfterMisses(policy, 0)).toBe(0);
    expect(rateAfterMisses(policy, 1)).toBe(0);
    expect(rateAfterMisses(policy, 2)).toBe(1);
    expect(expectedAttempts(policy)).toBe(3);
  });

  it("sums the first-hit probabilities to one", () => {
    let sum = 0;
    for (let attempt = 1; attempt <= sample.hardGuaranteeAt + 1; attempt += 1) {
      sum += hitProbabilityAtAttempt(sample, attempt);
    }
    expect(sum).toBeCloseTo(1, 8);
  });
});

describe("simulation", () => {
  it("is deterministic for a seed", () => {
    const a = rollUntilHit(sample, () => 0.5);
    const b = rollUntilHit(sample, () => 0.5);
    expect(a).toEqual(b);
    expect(a[0]?.hit).toBe(false);
  });

  it("stops on the first success", () => {
    const rolls = rollUntilHit(sample, () => 0);
    expect(rolls).toHaveLength(1);
    expect(rolls[0]?.forced).toBe(false);
  });

  it("counts a forced ending when nothing hits early", () => {
    const rolls = rollUntilHit(sample, () => 0.99);
    expect(rolls.at(-1)?.forced).toBe(true);
    expect(rolls).toHaveLength(sample.hardGuaranteeAt + 1);
    const summary = summarize({ ...sample, baseRate: 0, step: 0, cap: 0 }, 1, 20);
    expect(summary.meanAttempts).toBe(sample.hardGuaranteeAt + 1);
    expect(summary.forcedShare).toBe(1);
  });
});

describe("copy", () => {
  it("names the three rules and refuses to claim a pack was opened", () => {
    const lines = plainLanguage(sample);
    expect(lines[0]).toContain("5.00%");
    expect(lines[0]).toContain("10 misses");
    expect(lines[2]).toContain("40 misses");
    expect(lines[3]).toMatch(/does not open a pack/i);
  });
});
