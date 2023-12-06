export default function sort<N extends number | bigint>(
  nums: N[],
  dec = false,
) {
  const f = dec ? -1 : 1
  nums.sort(
    (a, b) =>
      (a > b ? 1
      : a < b ? -1
      : 0) * f,
  )
  return nums
}

export function min<N extends number | bigint>(
  nums: Iterable<N>,
  count = 1,
): [N, N[]] {
  const it = nums[Symbol.iterator]()
  let res: N[] = []
  for (let r = it.next(); !r.done && res.length < count; r = it.next())
    res.push(r.value)
  sort(res)
  const last = count - 1
  for (let r = it.next(); !r.done; r = it.next()) {
    const num = r.value
    if (num < res[last]!) {
      res[last] = num
      sort(res)
    }
  }
  if (!res.length)
    throw new RangeError('input iterator yield at least one item')
  return res as [N, N[]]
}

export function max<N extends number | bigint>(
  nums: Iterable<N>,
  count = 1,
): [N, N[]] {
  const it = nums[Symbol.iterator]()
  let res: N[] = []
  for (let r = it.next(); !r.done && res.length < count; r = it.next())
    res.push(r.value)
  sort(res, true)
  const last = count - 1
  for (let r = it.next(); !r.done; r = it.next()) {
    const num = r.value
    if (num > res[last]!) {
      res[last] = num
      sort(res, true)
    }
  }
  if (!res.length)
    throw new RangeError('input iterator yield at least one item')
  return res as [N, N[]]
}
