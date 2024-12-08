import {posMod} from './math.js'

export interface Vec2 {
  [0]: number
  [1]: number
  [Symbol.iterator](): Iterator<number>

  add(v: Vec2): Vec2
  subtract(v: Vec2): Vec2
  scale(f: number): Vec2
  invert(): Vec2
  mod(v: Vec2): Vec2
  lerp(to: Vec2, f: number): Vec2
  min(v: Vec2): Vec2
  max(v: Vec2): Vec2

  /** Calculate pythagorean length. */
  get len(): number
  /** Calculate taxicab/manhattan length. */
  get taxiLen(): number

  equals(v: Vec2): boolean
  inArea(min: Vec2, max: Vec2): boolean
  inArea(max: Vec2): boolean

  range(to: Vec2, inclusive?: boolean): IterableIterator<Vec2>

  fmt(): string
}

export class Vec2Class extends Float64Array implements Vec2 {
  [0]: number;
  [1]: number
  constructor(x = 0, y = 0, len = 2) {
    super(len)
    this[0] = x
    this[1] = y
  }

  // Patch default string format.
  static name = 'Vec'
  get [Symbol.toStringTag]() {
    return '' as any
  }

  add(v: Vec2) {
    return vec2(this[0] + v[0], this[1] + v[1])
  }

  subtract(v: Vec2) {
    return vec2(this[0] - v[0], this[1] - v[1])
  }

  scale(f: number) {
    return vec2(this[0] * f, this[1] * f)
  }

  invert() {
    return vec2(-this[0], -this[1])
  }

  mod(mod: Vec2) {
    return vec2(posMod(this[0], mod[0]), posMod(this[1], mod[1]))
  }

  lerp(to: Vec2, f: number) {
    return vec2(
      this[0] + f * (to[0] - this[0]),
      this[1] + f * (to[1] - this[1]),
    )
  }

  min(v: Vec2): Vec2 {
    return vec2(Math.min(this[0], v[0]), Math.min(this[1], v[1]))
  }

  max(v: Vec2): Vec2 {
    return vec2(Math.max(this[0], v[0]), Math.max(this[1], v[1]))
  }

  get len(): number {
    return Math.sqrt(this[0] ** 2 + this[1] ** 2)
  }

  get taxiLen(): number {
    return Math.abs(this[0]) + Math.abs(this[1])
  }

  equals(v: Vec2): boolean {
    return this[0] === v[0] && this[1] === v[1]
  }

  inArea(min: Vec2, max: Vec2): boolean
  inArea(max: Vec2): boolean
  inArea(min: Vec2, max?: Vec2): boolean {
    if (max === undefined) {
      max = min
      min = vec2(0, 0)
    }
    const [x, y] = this
    return x >= min[0] && y >= min[1] && x < max[0] && y < max[1]
  }

  *range(to: Vec2, inclusive = false) {
    const from = this
    const d = to.subtract(from)
    const steps = Math.max(Math.abs(d[0]), Math.abs(d[1]))
    for (let i = 0; i < steps; i++) yield from.lerp(to, i / steps)
    if (inclusive) yield to
  }

  fmt() {
    return `${this[0]},${this[1]}`
  }
  static parse(s: string): Vec2 {
    const [x = '', y = ''] = s.split(',', 2)
    return vec2(Number(x), Number(y))
  }
}

function vec2(x?: number, y?: number): Vec2 {
  return new Vec2Class(x, y) as unknown as Vec2
}
vec2.parse = Vec2Class.parse
export {vec2}

export class Vec2Set {
  #set = new Set<string>()

  constructor(vecs?: Iterable<Vec2>) {
    for (const v of vecs ?? []) this.add(v)
  }

  add(v: Vec2) {
    this.#set.add(this.#encode(v))
  }
  delete(v: Vec2) {
    this.#set.delete(this.#encode(v))
  }
  has(v: Vec2) {
    return this.#set.has(this.#encode(v))
  }
  get size() {
    return this.#set.size
  }
  *[Symbol.iterator]() {
    for (const s of this.#set) yield this.#decode(s)
  }

  #encode(v: Vec2) {
    return v.fmt()
  }
  #decode(s: string) {
    return vec2.parse(s)
  }
}
