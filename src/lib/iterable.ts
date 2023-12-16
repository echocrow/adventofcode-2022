export function* range(from: number, to: number, inclusive = false) {
  const d = from <= to ? 1 : -1
  for (let i = from; i !== to; i += d) yield i
  if (inclusive) yield to
}

export function mapFind<T, U>(
  items: Iterable<T>,
  fn: (val: T) => U | undefined,
): U | undefined {
  for (const val of items) {
    const mapped = fn(val)
    if (mapped !== undefined) return mapped
  }
  return undefined
}

export function* entries<T>(values: Iterable<T>) {
  let i = 0
  for (const val of values) yield [i++, val] as const
}

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

export function min<T extends number | bigint>(
  nums: Iterable<T>,
): T | undefined {
  let res: T | undefined = undefined
  for (const val of nums) if (val <= (res ?? val)) res = val
  return res
}
export function max<T extends number | bigint>(
  nums: Iterable<T>,
): T | undefined {
  let res: T | undefined = undefined
  for (const val of nums) if (val >= (res ?? val)) res = val
  return res
}
