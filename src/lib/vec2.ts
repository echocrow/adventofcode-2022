import {posMod} from './math.js'

export interface ReadonlyVec2 {
  readonly 0: number
  readonly 1: number
}

export interface Vec2 extends ReadonlyVec2 {
  [index: number]: never
  // @ts-expect-error
  [0]: number
  // @ts-expect-error
  [1]: number

  [Symbol.iterator](): ArrayIterator<number>
}

export class Vec2 extends Float64Array {
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
  return new Vec2(x, y)
}
vec2.parse = Vec2.parse
export {vec2}
