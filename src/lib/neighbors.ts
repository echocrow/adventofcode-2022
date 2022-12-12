import type {Matrix} from './matrix.js'

export function* neighbors(
  m: Matrix,
  i: number,
): Generator<number, void, undefined> {
  const w = m.width
  const h = m.height
  const x = i % w
  const y = (i - x) / w
  if (x) yield -1 + i
  if (x < w - 1) yield +1 + i
  if (y) yield -w + i
  if (y < h - 1) yield w + i
}

export function* squareNeighbors(
  m: Matrix,
  i: number,
): Generator<number, void, undefined> {
  const ns = [...neighbors(m, i)]
  let dn: number
  for (let j = 0; j < ns.length; j++) {
    yield ns[j]!
    for (let k = j + 1; k < ns.length; k++) {
      if ((dn = ns[j]! - i + ns[k]!) !== i) yield dn
    }
  }
}
