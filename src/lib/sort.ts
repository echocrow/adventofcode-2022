export default function sort<N extends number | bigint>(
  nums: N[],
  dec = false,
) {
  const f = dec ? -1 : 1
  nums.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0) * f)
  return nums
}
