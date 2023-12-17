export default function sort<N extends number | bigint>(
  nums: N[],
  dec = false,
) {
  const f = dec ? -1 : 1
  return nums.sort((a, b) =>
    a > b ? f
    : a < b ? -f
    : 0,
  )
}
