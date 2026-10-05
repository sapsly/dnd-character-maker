import type { CoinPurse } from '../types/character';

/**
 * Convert a gold-piece amount to a CoinPurse using integer copper arithmetic.
 *
 * Avoids floating-point drift by:
 * 1. Rounding the GP value to the nearest copper (gp * 100, then Math.round)
 * 2. Decomposing the integer copper count into gp/sp/cp via integer division
 *
 * This matches D&D's base-10 coin system: 1 gp = 10 sp = 100 cp.
 */
export function gpToCoinPurse(gp: number): CoinPurse {
  // Round to nearest copper to avoid floating-point representation issues
  // e.g., 0.1 * 100 = 10.000000000000001 -> Math.round -> 10
  const totalCp = Math.round(gp * 100);

  const gpResult = Math.floor(totalCp / 100);
  const remainderAfterGp = totalCp % 100;
  const spResult = Math.floor(remainderAfterGp / 10);
  const cpResult = remainderAfterGp % 10;

  return { cp: cpResult, sp: spResult, gp: gpResult };
}

/**
 * Sum two CoinPurses together.
 */
export function addCoinPurses(a: CoinPurse, b: CoinPurse): CoinPurse {
  return {
    cp: a.cp + b.cp,
    sp: a.sp + b.sp,
    gp: a.gp + b.gp,
  };
}

/**
 * Normalize a CoinPurse so cp < 10 and sp < 10 (carry overflow upward).
 * Not strictly needed for starting equipment (values are already normalized),
 * but useful if coins are ever added manually.
 */
export function normalizeCoinPurse(purse: CoinPurse): CoinPurse {
  let totalCp = purse.gp * 100 + purse.sp * 10 + purse.cp;
  const gp = Math.floor(totalCp / 100);
  totalCp %= 100;
  const sp = Math.floor(totalCp / 10);
  const cp = totalCp % 10;
  return { cp, sp, gp };
}