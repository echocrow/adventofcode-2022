import {copyArr, copyEmptyArr, type AnyArray, setArr} from './array.js'
import {range} from './iterable.js'
import {posMod} from './math.js'
import type {Lengthened, Sliceable} from './types.js'
import type {ReadonlyVec2, Vec2} from './vec2.js'
import vec from './vec.js'

interface MatrixLike extends Lengthened {
  width: number
  height: number
}

export class Matrix<T extends AnyArray = AnyArray>
  implements MatrixLike, Sliceable<T>, Iterable<T[number]>
{
  #width: number
  #height: number

  constructor(
    private data: T,
    width: number = 0,
  ) {
    if (data.length % width)
      throw new RangeError('data length does not match matrix width')
    this.#width = width
    this.#height = width ? this.length / width : 0
  }

  get $(): T {
    return this.data
  }

  get length(): number {
    return this.data.length
  }

  [Symbol.iterator](): Iterator<T[number]> {
    return this.data[Symbol.iterator]()
  }

  slice(start?: number | undefined, end?: number | undefined): T {
    return this.data.slice(start, end) as T
  }

  #setData(data: T): void {
    this.data = data
    this.#height = this.#width ? this.length / this.#width : 0
  }

  get width(): number {
    return this.#width
  }
  get height(): number {
    return this.#height
  }
  get dims(): Vec2 {
    return vec(this.#width, this.#height)
  }

  pushRow(row: ArrayLike<T[number]> & Lengthened) {
    if (this.#width && row.length % this.#width)
      throw new RangeError('row length does not match matrix width')
    const data = copyEmptyArr(this.data, this.length + row.length)
    setArr(data, this.data)
    setArr(data, row, this.length)
    this.#width ||= row.length
    this.#setData(data)
    return this
  }
  clear() {
    this.#setData(copyEmptyArr(this.data, 0))
    this.#width = 0
  }

  *transposedKeys() {
    yield* transposedKeys(this)
  }
  transpose(): Matrix<T> {
    const out = new Matrix(copyArr(this.data), this.height)
    let i = 0
    for (const from of this.transposedKeys()) out.data[i++] = this.data[from]!
    return out
  }

  *rotatedKeys(times = 1) {
    yield* rotatedKeys(this, times)
  }
  rotate(times = 1): Matrix<T> {
    times = posMod(times, 4)
    if (!times) return this
    const newW = times % 2 ? this.height : this.width
    const out = new Matrix(copyArr(this.data), newW)
    let i = 0
    for (const from of this.rotatedKeys(times)) out.data[i++] = this.data[from]!
    return out
  }

  *rows(): Generator<T, void, undefined> {
    yield* rows<T>(this)
  }

  *rowI(y: number): Generator<number, void, undefined> {
    const from = y * this.#width
    const to = from + this.#width
    for (let i = from; i < to; i++) yield i
  }
  *row(y: number): Generator<T[number], void, undefined> {
    for (const i of this.rowI(y)) yield this.data[i]
  }
  setRow(y: number, vals: ArrayLike<number>): this {
    if (vals.length !== this.width)
      throw new RangeError('row length does not match matrix width')
    setArr(this.data, vals, y * this.width)
    return this
  }

  *colI(x: number): Generator<number, void, undefined> {
    for (let i = x; i < this.length; i += this.#width) yield i
  }
  *col(x: number): Generator<T[number], void, undefined> {
    for (const i of this.colI(x)) yield this.data[i]
  }
  *cols(): Generator<T, void, undefined> {
    for (let x = 0; x < this.width; x++) {
      const col = copyEmptyArr(this.data, this.height)
      for (let y = 0; y < this.height; y++) col[y] = this.cell(x, y)!
      yield col
    }
  }

  cell(v: ReadonlyVec2): T[number] | undefined
  cell(x: number, y: number): T[number] | undefined
  cell(x: ReadonlyVec2 | number, y = 0): T[number] | undefined {
    if (typeof x !== 'number') (y = x[1]), (x = x[0])
    if (x < 0 || x >= this.width) return undefined
    if (y < 0 || y >= this.height) return undefined
    return this.data[y * this.width + x]
  }
  setCell(v: ReadonlyVec2, val: number): this
  setCell(x: number, y: number, val: number): this
  setCell(x: ReadonlyVec2 | number, y: number, val = y): this {
    if (typeof x !== 'number') (y = x[1]), (x = x[0])
    this.data[y * this.width + x] = val
    return this
  }

  sliceRows(startY?: number, endY?: number): Matrix<T> {
    return new Matrix(
      this.slice(
        (startY ?? 0) * this.width,
        (endY ?? this.height) * this.width,
      ),
      this.width,
    )
  }

  iToVec(i: number): Vec2 {
    const x = i % this.width
    const y = (i - x) / this.width
    return vec(x, y)
  }
  vecToI(v: ReadonlyVec2): number
  vecToI(x: number, y: number): number
  vecToI(x: ReadonlyVec2 | number, y = 0): number {
    if (typeof x !== 'number') (y = x[1]), (x = x[0])
    return y * this.width + x
  }

  moveBy(i: number, v: ReadonlyVec2): number | undefined {
    const from = this.iToVec(i)
    const [toX, toY] = from.add(v)
    if (toX < 0 || toX >= this.width) return undefined
    if (toY < 0 || toY >= this.height) return undefined
    return this.vecToI(toX, toY)
  }

  fmt(
    fmtVal: (val: number, i: number) => string | number = (val) => val,
  ): string {
    let out = ''
    for (let y = 0; y < this.#height; y++) {
      for (const i of this.rowI(y)) out += fmtVal(this.data[i], i)
      out += '\n'
    }
    return out.slice(0, -1)
  }
}

export class Uint8Matrix extends Matrix<Uint8Array> {
  constructor()
  constructor(matrix: Matrix)
  constructor(dims: ReadonlyVec2)
  constructor(length: number, width: number)
  constructor(
    array: ArrayLike<number> | ArrayBufferLike | Iterable<number>,
    width: number | undefined,
  )
  constructor(lengthOrArray: any = 0, width?: number) {
    if (lengthOrArray instanceof Matrix) width ??= lengthOrArray.width
    else if (width === undefined && lengthOrArray.length === 2)
      lengthOrArray = lengthOrArray[0] * (width = lengthOrArray[1] ?? 0)
    super(new Uint8Array(lengthOrArray), width ?? 0)
  }
}

export class Uint16Matrix extends Matrix<Uint16Array> {
  constructor()
  constructor(matrix: Matrix)
  constructor(dims: ReadonlyVec2)
  constructor(length: number, width: number)
  constructor(
    array: ArrayLike<number> | ArrayBufferLike | Iterable<number>,
    width: number | undefined,
  )
  constructor(lengthOrArray: any = 0, width?: number) {
    if (lengthOrArray instanceof Matrix) width ??= lengthOrArray.width
    else if (width === undefined && lengthOrArray.length === 2)
      lengthOrArray = lengthOrArray[0] * (width = lengthOrArray[1] ?? 0)
    super(new Uint16Array(lengthOrArray), width ?? 0)
  }
}

export function* rows<T>(
  m: MatrixLike & Sliceable<T>,
): Generator<T, void, undefined> {
  for (let i = 0; i < m.length; i += m.width) {
    yield m.slice(i, i + m.width)
  }
}

export function* transposedKeys(
  m: MatrixLike,
): Generator<number, void, undefined> {
  const w = m.width
  const newW = m.height
  for (let i = 0; i < m.length; i++) {
    const y = i % newW
    const x = (i - y) / newW
    yield y * w + x
  }
}

export function* rotatedKeys(
  m: MatrixLike,
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
    const x =
      double ? w - newX - 1
      : pos ? newY
      : w - newY - 1
    const y =
      double ? h - newY - 1
      : pos ? h - newX - 1
      : newX
    yield y * w + x
  }
}

export function* neighbors(
  m: MatrixLike,
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
  m: MatrixLike,
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
