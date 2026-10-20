# Pity rates and a hard guarantee

**Trust label:** `educational-reference`  
**Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

A drop that says "5%" and then quietly changes the odds is a trust problem, not a UI problem. This repo is the arithmetic a designer can publish before anyone writes a contract: base rate, soft pity, a cap, and a hard guarantee.

It does not open an Atomic pack. It does not call AtomicAssets. A website that simulates pity is not the draw.

## What you can learn

- How a miss streak changes the chance of the next attempt.
- Why "expected attempts" is a finite number only because the guarantee forces a hit.
- What to tell a player in one paragraph, including the sentence that this page did not open a pack.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `examples/pity.ts` | Pure policy, rates, exact expectation, seeded rolls |
| `examples/pity.test.ts` | The claims in the verification log |
| `examples/Demo.tsx` | Offline form. Same seed, same summary |

`npm test` runs the math. `npm run dev` opens the form. No wallet, no API key.

## The rule, in order

`rateAfterMisses(policy, misses)`:

1. If `misses >= hardGuaranteeAt`, the rate is `1`. The attempt is forced.
2. If `misses < softStart`, the rate is `baseRate`.
3. Otherwise the rate is `baseRate + (misses - softStart + 1) * step`, and it does not pass `cap`.

The sample policy is 5% until 10 misses, then +2 points per extra miss, capped at 25%, forced after 40 misses.

## Use it somewhere else

Copy `examples/pity.ts`. Keep the policy next to the copy you show players. If the contract uses a different curve, do not import this function and pretend it describes that contract.

A contract draw has to use the same inputs: the miss counter that the contract itself stores, not a counter in the browser. Client-side pity that the server can ignore is an anti-pattern. So is a published "5%" that omits the step and the guarantee.

## Edge cases

- `hardGuaranteeAt` must be an integer greater than `softStart`. A guarantee that sits inside the base-rate window is rejected so the two rules cannot silently overlap.
- A step of `0` and a base rate of `0` is allowed. Every attempt misses until the force. The tests lock that in: three attempts when the guarantee is `2`.
- Rates are not rounded for the math. The demo prints two decimal places for people. Do not round inside the contract and in the UI to different values and call them the same policy.
- `rollUntilHit` stops at `hardGuaranteeAt + 1` even if a caller passes an `rng` that never returns a small number.

## Best practice and the opposite

**Do** publish the four numbers and the miss counter the contract will store. **Do** make the forced attempt obvious in the UI with the word "forced", not only a color.

**Do not** call a client simulation "provably fair" because it uses a seed. The seed here is for a repeatable lesson. A real draw needs the contract's randomness story, which this repo does not implement.

**Do not** raise the rate in the UI while the contract still uses the base rate.

## Antelope notes

The math is not WAX-specific. WAX-shaped drops usually live in a contract action plus an AtomicAssets template. Porting the lesson means re-reading that action's table, not this file. Other Antelope chains can use the same function if their drop contract matches the policy. This repo has not checked any of those contracts.

## Live path, not shipped

```
contract miss counter + published policy --> same function as examples/pity.ts --> player-facing sentence
```

Until that equality is tested against a real action, the trust label stays `educational-reference`.

## Related

- [wax-drops-and-pack-opening-experience](https://github.com/pixel-journey/wax-drops-and-pack-opening-experience) — reveal UX, separate from this math
- [wax-advanced-drop-mechanics-toolkit](https://github.com/pixel-journey/wax-advanced-drop-mechanics-toolkit) — still a README as of this pass; do not treat it as an implementation

## Run

```bash
npm install
npm test
npm run dev
```
