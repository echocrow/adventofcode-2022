export function sum(nums: Iterable<number>): number {
  let s = 0
  for (const v of nums) s += v
  return s
}

export function bigSum(nums: Iterable<bigint>): bigint {
  let s = 0n
  for (const v of nums) s += v
  return s
}
