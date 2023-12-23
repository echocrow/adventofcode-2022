export function intersect<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  const res: Set<T> = new Set()
  for (const v of s1) if (s2.has(v)) res.add(v)
  return res
}

export function exclude<T>(s: Set<T>, exclusions: Set<T>): Set<T> {
  const res = new Set<T>()
  for (const v of s) if (!exclusions.has(v)) res.add(v)
  return res
}

export function unionInto<T>(set: Set<T>, items: Iterable<T>): Set<T> {
  for (const v of items) set.add(v)
  return set
}

export function isSuperSet<T>(set: Set<T>, items: Iterable<T>): boolean {
  for (const v of items) if (!set.has(v)) return false
  return true
}
