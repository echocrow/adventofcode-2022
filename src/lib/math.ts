export function posMod(num: number, mod: number): number {
  return ((num % mod) + mod) % mod
}
