export default function intersect<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  const res: Set<T> = new Set()
  for (const v of s1) if (s2.has(v)) res.add(v)
  return res
}
