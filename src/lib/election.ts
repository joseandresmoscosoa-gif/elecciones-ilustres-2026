export const URNAS_CIERRAN_EN = "2026-11-22T23:59:59-05:00";

export function urnasAbiertas(now: Date = new Date()): boolean {
  return now.getTime() < new Date(URNAS_CIERRAN_EN).getTime();
}
