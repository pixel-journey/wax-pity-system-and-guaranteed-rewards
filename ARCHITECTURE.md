# Architecture

```
PityPolicy
    |
    +--> rateAfterMisses(misses) --> one probability
    |
    +--> expectedAttempts() -------> exact mean, finite because of the guarantee
    |
    +--> rollUntilHit(seeded rng) --> one path, forced if nothing hit
```

The demo reads the form, calls those functions, and renders a table. It does not keep a miss counter for a real account.

## Decisions

**The guarantee is a rate of 1, and also a boolean.** `forced` is true only when the miss count has reached `hardGuaranteeAt`. A soft-pity cap of 1 would still not be labeled forced. The word matters.

**Expectation is a loop, not a Monte Carlo.** The seeded summary is a check you can eyeball against the exact mean. It is not the definition.

**No RNG library.** `mulberry32` is here so two runs of the demo match. It is not a randomness beacon.

## Live path (not shipped)

Store the miss count in the contract that pays out. Publish the same four numbers this function takes. If the numbers differ, the UI is wrong even when the math is right.
