import posMod from './math.js'
import type {Lengthened} from './types.js'

export interface Matrix extends Lengthened {
  length: number
  width: number
  height: number
}

export class Uint8Matrix extends Uint8Array implements Matrix {
  #width: number
  #height: number

  constructor()
  constructor(length: number, width: number)
  constructor(array: ArrayLike<number> | ArrayBufferLike, width: number)
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
    if (row.length !== ab.#width) {
      throw new RangeError('row length does not match matrix width')
    }
    ab.set(this)
    ab.set(row, this.length)
    return ab
  }

  *transposedKeys() {
    const w = this.width
    const newW = this.height
    for (let i = 0; i < this.length; i++) {
      const y = i % newW
      const x = (i - y) / newW
      yield y * w + x
    }
  }
  transpose(): Uint8Matrix {
    const out = new Uint8Matrix(this.length, this.height)
    let i = 0
    for (const from of this.transposedKeys()) out[i++] = this[from]!
    return out
  }

  *rotatedKeys(times = 1) {
    times = posMod(times + 1, 4) - 1
    if (!times) return yield* this.keys()
    const double = times === 2
    const pos = times > 0
    const [w, h] = [this.width, this.height]
    const newW = double ? w : h
    for (let i = 0; i < this.length; i++) {
      const newX = i % newW
      const newY = (i - newX) / newW
      const x = double ? w - newX - 1 : pos ? newY : w - newY - 1
      const y = double ? h - newY - 1 : pos ? h - newX - 1 : newX
      yield y * w + x
    }
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
    for (let i = 0; i < this.length; i += this.width) {
      yield this.slice(i, i + this.width)
    }
  }
}
