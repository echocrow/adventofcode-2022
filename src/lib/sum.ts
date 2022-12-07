interface Reducible<R, T> {
  reduce(
    callbackfn: (previousValue: R, currentValue: T, currentIndex: number) => R,
    initialValue: R,
  ): R
}

export default function sum(nums: Reducible<any, number>): number {
  return nums.reduce((a, b) => a + b, 0)
}

export function bigSum(nums: Reducible<any, bigint>): bigint {
  return nums.reduce((a, b) => a + b, BigInt(0))
}
