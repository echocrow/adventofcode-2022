export default function sort<N extends number | bigint>(nums: N[]) {
  nums.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
  return nums
}
