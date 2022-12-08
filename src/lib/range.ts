export default function* range(from: number, to: number, inclusive = false) {
  const d = from <= to ? 1 : -1
  for (let i = from; i !== to; i += d) {
    yield i
  }
  if (inclusive) yield to
}
