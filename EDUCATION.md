# Pity rates and a hard guarantee — designer arithmetic, not a pack open

**Trust label:** `educational-reference`  
**Status:** pure functions only. Not on-chain. Not compiled. No broadcast. No pack is opened.  
**Official sources:**  
- [docs.wax.io How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets)  
- [pinknetworkx/atomicpacks-contract](https://github.com/pinknetworkx/atomicpacks-contract) (fixed odds per roll; no built-in soft/hard pity counter)  
- [atomicassets-contract v2.0.0](https://github.com/atomicassets/atomicassets-contract/releases/tag/v2.0.0) (the live contract line; the pink.network wiki still describes v1)

This file exists so a designer, creator, or AI vibe-coder can predict the exact rate a published policy produces, and so a developer knows the contract must store the miss counter itself.

## Scene

A drop page says “5%”. After ten misses the chance rises. After forty the next attempt is forced. The browser simulation uses the same numbers. The contract that actually mints must use the same numbers and the same miss counter, or the page is lying.

Predict, then run:

```bash
npm test
```

## The rule, in order (`rateAfterMisses`)

| Condition | Rate | Notes |
| --- | --- | --- |
| `misses >= hardGuaranteeAt` | `1` | Forced. The attempt cannot miss. |
| `misses < softStart` | `baseRate` | Soft pity has not started. |
| otherwise | `min(cap, baseRate + (misses - softStart + 1) * step)` | Soft line, then hard force still applies. |

Sample policy: 5% until 10 misses, then +2 points per extra miss, capped at 25%, forced after 40 misses.

## Predict-run table (sample policy)

| Misses before attempt | Rate | Forced? | Source function |
| --- | --- | --- | --- |
| 0–9 | 0.05 | no | `rateAfterMisses` |
| 10 | ~0.07 | no | first soft step |
| 30 | 0.25 | no | hit the cap |
| 40+ | 1 | yes | hard guarantee |

`expectedAttempts` is finite only because the hard guarantee forces a hit. A pure geometric with no force can have infinite expectation.

## Attack / mistake table

| Mistake | What happens | How to avoid | Test |
| --- | --- | --- | --- |
| Publish “5%” and omit the step and guarantee | Players cannot verify the real curve | Publish all four numbers + the miss counter | `plainLanguage` |
| Client-side pity the contract ignores | UI shows rising odds; contract still uses base rate | Store the counter in the contract; feed the same function | not modeled (no chain) |
| `hardGuaranteeAt <= softStart` | Policy rejected | Keep guarantee strictly after soft start | `assertPolicy` |
| Step of 0 and base of 0 | Every attempt misses until force | Allowed; tests lock it | `expectedAttempts` = guarantee + 1 |
| Round differently in UI vs contract | Numbers diverge | Do not round inside the rate function | demo prints two decimals; math stays exact |
| Call a seeded browser roll “provably fair” | Misleading | Seed is for a repeatable lesson only | `rollUntilHit` |

## Interlinks

- Pack open path (transfer + claim, exact refusal strings): [wax-drops-and-pack-opening-experience](https://github.com/pixel-journey/wax-drops-and-pack-opening-experience)
- Different curve (bonus added to every tier, no renormalize): [wax-advanced-drop-mechanics-toolkit](https://github.com/pixel-journey/wax-advanced-drop-mechanics-toolkit)
- Template / schema rules that the minted NFTs must still satisfy: [wax-atomic-template-and-schema-explorer](https://github.com/pixel-journey/wax-atomic-template-and-schema-explorer)
- Mutable data on the resulting assets: the `px-aa-mutable-*` labs

## What this lab does not do

- It does not open an Atomic pack or call `atomicpacksx`.
- It does not read or write any on-chain table.
- It does not claim to match `atomicdropsx` or any other drop contract’s ABI.
- It does not estimate RAM or broadcast.
- A successful `rateAfterMisses` is not a mint.

Always re-verify the live drop or pack contract before any production sign. The arithmetic is only as fair as the contract that stores the miss counter and uses the same numbers.
