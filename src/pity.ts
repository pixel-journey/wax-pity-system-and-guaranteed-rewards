/** Pity math for a designer. This file does not open a pack or call a chain. */

export type PityPolicy = {
  /** Chance before soft pity starts. 0 to 1. */
  baseRate: number;
  /** Misses required before the rate rises. The next attempt is the first boosted one. */
  softStart: number;
  /** Added to the rate for each miss at or past softStart, before the cap. */
  step: number;
  /** Soft pity stops here. The hard guarantee can still force 1. */
  cap: number;
  /** When misses reach this count, the next attempt is forced. */
  hardGuaranteeAt: number;
};

export const SAMPLE_POLICY: PityPolicy = {
  baseRate: 0.05,
  softStart: 10,
  step: 0.02,
  cap: 0.25,
  hardGuaranteeAt: 40,
};

export function assertPolicy(policy: PityPolicy): void {
  if (!(policy.baseRate >= 0 && policy.baseRate <= 1)) throw new Error("baseRate must be between 0 and 1");
  if (!(policy.cap >= policy.baseRate && policy.cap <= 1)) throw new Error("cap must sit between baseRate and 1");
  if (!(policy.step >= 0)) throw new Error("step must be >= 0");
  if (!Number.isInteger(policy.softStart) || policy.softStart < 0) throw new Error("softStart must be an integer >= 0");
  if (!Number.isInteger(policy.hardGuaranteeAt) || policy.hardGuaranteeAt <= policy.softStart) {
    throw new Error("hardGuaranteeAt must be an integer greater than softStart");
  }
}

/** `misses` is how many non-hits came immediately before this attempt. */
export function rateAfterMisses(policy: PityPolicy, misses: number): number {
  assertPolicy(policy);
  if (!Number.isInteger(misses) || misses < 0) throw new Error("misses must be an integer >= 0");
  if (misses >= policy.hardGuaranteeAt) return 1;
  if (misses < policy.softStart) return policy.baseRate;
  const steps = misses - policy.softStart + 1;
  return Math.min(policy.cap, policy.baseRate + steps * policy.step);
}

/** Chance the first hit lands on this 1-based attempt, and not earlier. */
export function hitProbabilityAtAttempt(policy: PityPolicy, attempt: number): number {
  if (!Number.isInteger(attempt) || attempt < 1) throw new Error("attempt must be an integer >= 1");
  let survival = 1;
  for (let prior = 1; prior < attempt; prior += 1) {
    survival *= 1 - rateAfterMisses(policy, prior - 1);
  }
  return survival * rateAfterMisses(policy, attempt - 1);
}

/** Exact mean attempts until the first hit. The hard guarantee makes this finite. */
export function expectedAttempts(policy: PityPolicy): number {
  const maxAttempt = policy.hardGuaranteeAt + 1;
  let expected = 0;
  let survival = 1;
  for (let attempt = 1; attempt <= maxAttempt; attempt += 1) {
    const rate = rateAfterMisses(policy, attempt - 1);
    expected += attempt * survival * rate;
    survival *= 1 - rate;
  }
  return expected;
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Roll = {
  attempt: number;
  missesBefore: number;
  rate: number;
  hit: boolean;
  forced: boolean;
};

export function rollUntilHit(policy: PityPolicy, rng: () => number): Roll[] {
  const rolls: Roll[] = [];
  let misses = 0;
  const maxAttempt = policy.hardGuaranteeAt + 1;
  for (let attempt = 1; attempt <= maxAttempt; attempt += 1) {
    const rate = rateAfterMisses(policy, misses);
    const forced = misses >= policy.hardGuaranteeAt;
    const hit = forced || rng() < rate;
    rolls.push({ attempt, missesBefore: misses, rate, hit, forced });
    if (hit) return rolls;
    misses += 1;
  }
  return rolls;
}

export type SimulationSummary = {
  runs: number;
  meanAttempts: number;
  forcedShare: number;
};

export function summarize(policy: PityPolicy, seed: number, runs: number): SimulationSummary {
  if (!Number.isInteger(runs) || runs < 1) throw new Error("runs must be an integer >= 1");
  let total = 0;
  let forced = 0;
  for (let i = 0; i < runs; i += 1) {
    const rolls = rollUntilHit(policy, mulberry32((seed + i * 997) >>> 0));
    total += rolls.length;
    if (rolls[rolls.length - 1]?.forced) forced += 1;
  }
  return { runs, meanAttempts: total / runs, forcedShare: forced / runs };
}

export function plainLanguage(policy: PityPolicy): string[] {
  assertPolicy(policy);
  const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
  return [
    `Each attempt is ${pct(policy.baseRate)} until there have been ${policy.softStart} misses in a row.`,
    `After that, the chance rises by ${pct(policy.step)} for each extra miss, and soft pity never passes ${pct(policy.cap)}.`,
    `If there are still ${policy.hardGuaranteeAt} misses, the next attempt is forced.`,
    "This page does not open a pack. A drop is only as fair as the contract that draws the number.",
  ];
}

export type RateRow = { misses: number; rate: number; forced: boolean };

export function rateTable(policy: PityPolicy): RateRow[] {
  const rows: RateRow[] = [];
  for (let misses = 0; misses <= policy.hardGuaranteeAt; misses += 1) {
    rows.push({
      misses,
      rate: rateAfterMisses(policy, misses),
      forced: misses >= policy.hardGuaranteeAt,
    });
  }
  return rows;
}
