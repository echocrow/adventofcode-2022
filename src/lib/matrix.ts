import type {Lengthened, Matrix} from './types.js'

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

  transpose(): Uint8Matrix {
    const out = new Uint8Matrix(this.length, this.height)
    for (let from = 0; from < this.length; from++) {
      const x = from % this.width
      const y = (from - x) / this.width
      const to = x * out.width + y
      out[to] = this[from] ?? 0
    }
    return out
  }

  *rows() {
    for (let i = 0; i < this.length; i += this.width) {
      yield this.slice(i, i + this.width)
    }
  }
}
