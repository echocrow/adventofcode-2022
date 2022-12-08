import type {Reducible} from './types.js'

export default function product(nums: Reducible<any, number>): number {
  return nums.length ? nums.reduce((a, b) => a * b) : 0
}

export function bigProduct(nums: Reducible<any, bigint>): bigint {
  return nums.length ? nums.reduce((a, b) => a * b) : 0
}
