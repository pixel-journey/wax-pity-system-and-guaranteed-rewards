import { ATOMIC_ORIGIN, CHAIN_ORIGIN, atomicAssets, currencyBalance } from "./api";
import { SAMPLE_POLICY, expectedAttempts } from "./pity";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

export const USE_CASES: UseCase[] = [
  {
    title: "Balance before anyone talks about a pack",
    detail: "Pity math does not know a wallet. This is the nodeos call that returns WAX balance strings. The policy below still does not open a pack.",
    request: currencyBalance(CHAIN_ORIGIN, "alice"),
    transaction: null,
  },
  {
    title: "Templates you would have checked before copying a curve",
    detail: "AtomicAssets template reads are how you learn a collection's schema. They are not this pity function. samplecol is a placeholder collection name, not a live Pixel Journey collection.",
    request: atomicAssets(ATOMIC_ORIGIN, "alice", "samplecol"),
    transaction: null,
  },
];

export function assertUseCases(): void {
  const mean = expectedAttempts(SAMPLE_POLICY);
  if (!(mean > 1)) throw new Error("expected attempts should be above 1");
}
