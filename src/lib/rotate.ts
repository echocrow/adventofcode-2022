export default function rotate<T>(arr: T[], width: number): T[] {
  const rotated = new Array(arr.length)
  for (let from = 0; from < arr.length; from++) {
    const x = from % width
    const y = (from - x) / width
    const to = x * width + (width - y - 1)
    rotated[to] = arr[from] ?? 0
  }
  return rotated
}
