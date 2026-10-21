# Verification log

**Trust label:** educational-reference  
**Updated:** 2026-10-20

| Claim | Evidence | State |
| --- | --- | --- |
| Base rate holds for misses 0 through softStart - 1 | `src/pity.test.ts` | verified (unit) |
| Soft pity steps, then stops at the cap | same | verified (unit) |
| Hard guarantee returns rate 1 | same | verified (unit) |
| A zero-rate policy hits only on the forced attempt | same | verified (unit) |
| First-hit probabilities sum to 1 | same | verified (unit) |
| Plain geometric expectation is about 1 / baseRate | same | verified (unit) |
| Copy states that no pack is opened | same | verified (unit) |
| Demo renders the same functions | `src/Demo.tsx` | partial (inspection) |
| A live Atomic drop uses this curve | none | untested |
| WCAG audit | none | not claimed |
