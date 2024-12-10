export function intersection<T>(s1: Set<T>, s2: Iterable<T>): Set<T> {
  const res: Set<T> = new Set()
  for (const v of s2) if (s1.has(v)) res.add(v)
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
