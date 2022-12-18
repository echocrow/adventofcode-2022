import {posMod} from './math.js'
import range from './range.js'
import type {Lengthened, Sliceable} from './types.js'

export interface Matrix extends Lengthened {
  width: number
  height: number
}

export class Uint8Matrix extends Uint8Array implements Matrix {
  #width: number
  #height: number

  constructor()
  constructor(length: number, width: number)
  constructor(
    array: ArrayLike<number> | ArrayBufferLike | Iterable<number>,
    width: number,
  )
  constructor(lengthOrArray: any = 0, width = 0) {
    super(lengthOrArray)
    this.#width = width
    this.#height = this.length / width
  }

  get width() {
    return this.#width
  }
  get height() {
    return this.#height
  }

  concatRow(row: ArrayLike<number> & Lengthened) {
    const ab = new Uint8Matrix(
      this.length + row.length,
      this.#width || row.length,
    )
    if (row.length % ab.#width) {
      throw new RangeError('row length does not match matrix width')
    }
    ab.set(this)
    ab.set(row, this.length)
    return ab
  }

  *transposedKeys() {
    yield* transposedKeys(this)
  }
  transpose(): Uint8Matrix {
    const out = new Uint8Matrix(this.length, this.height)
    let i = 0
    for (const from of this.transposedKeys()) out[i++] = this[from]!
    return out
  }

  *rotatedKeys(times = 1) {
    yield* rotatedKeys(this, times)
  }
  rotate(times = 1): Uint8Matrix {
    times = posMod(times, 4)
    if (!times) return this
    const newW = times % 2 ? this.height : this.width
    const out = new Uint8Matrix(this.length, newW)
    let i = 0
    for (const from of this.rotatedKeys(times)) out[i++] = this[from]!
    return out
  }

  *rows() {
    yield* rows<Uint8Array>(this)
  }

  *row(y: number) {
    const from = y * this.#width
    const to = from + this.#width
    for (let i = from; i < to; i++) yield this[i]!
  }
  setRow(y: number, vals: ArrayLike<number>) {
    if (vals.length !== this.width)
      throw new RangeError('row length does not match matrix width')
    this.set(vals, y * this.width)
    return this
  }

  *col(x: number) {
    for (let i = x; i < this.length; i += this.#width) yield this[i]
  }

  cell(x: number, y: number): number {
    return this[y * this.width + x] ?? -1
  }
  setCell(x: number, y: number, v: number) {
    this[y * this.width + x] = v
    return this
  }
}

export function* rows<T>(
  m: Matrix & Sliceable<T>,
): Generator<T, void, undefined> {
  for (let i = 0; i < m.length; i += m.width) {
    yield m.slice(i, i + m.width)
  }
}

export function* transposedKeys(m: Matrix): Generator<number, void, undefined> {
  const w = m.width
  const newW = m.height
  for (let i = 0; i < m.length; i++) {
    const y = i % newW
    const x = (i - y) / newW
    yield y * w + x
  }
}

export function* rotatedKeys(
  m: Matrix,
  times = 1,
): Generator<number, void, undefined> {
  times = posMod(times + 1, 4) - 1
  if (!times) return yield* range(0, m.length)
  const double = times === 2
  const pos = times > 0
  const [w, h] = [m.width, m.height]
  const newW = double ? w : h
  for (let i = 0; i < m.length; i++) {
    const newX = i % newW
    const newY = (i - newX) / newW
    const x = double ? w - newX - 1 : pos ? newY : w - newY - 1
    const y = double ? h - newY - 1 : pos ? h - newX - 1 : newX
    yield y * w + x
  }
}

export function* neighbors(
  m: Matrix,
  i: number,
): Generator<number, void, undefined> {
  const w = m.width
  const h = m.height
  const x = i % w
  const y = (i - x) / w
  if (x) yield i - 1
  if (x < w - 1) yield i + 1
  if (y) yield i - w
  if (y < h - 1) yield i + w
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
