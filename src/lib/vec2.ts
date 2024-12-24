import {posMod} from './math.js'
import {VecSet, type Vec2 as BaseVec2} from './vec.js'

type InputVec2 = readonly [x: number, y: number, z?: any]

export interface Vec2
  extends BaseVec2,
    Omit<InstanceType<typeof Vec2Cls>, keyof Array<any>> {
  new (x: number, y: number): Vec2
}

const v2 = {
  add(a: InputVec2, b: InputVec2): BaseVec2 {
    return [a[0] + b[0], a[1] + b[1]]
  },
  subtract(a: InputVec2, b: InputVec2): BaseVec2 {
    return [a[0] - b[0], a[1] - b[1]]
  },

  min(a: InputVec2, b: InputVec2): BaseVec2 {
    return [Math.min(a[0], b[0]), Math.min(a[1], b[1])]
  },
  max(a: InputVec2, b: InputVec2): BaseVec2 {
    return [Math.max(a[0], b[0]), Math.max(a[1], b[1])]
  },

  len(v: InputVec2): number {
    return Math.sqrt(v[0] ** 2 + v[1] ** 2)
  },

  taxiLen(v: InputVec2): number {
    return Math.abs(v[0]) + Math.abs(v[1])
  },

  parse(s: string): Vec2 {
    const [x = '', y = ''] = s.split(',', 2)
    return vec2(Number(x), Number(y))
  },

  via(v: InputVec2): Vec2 {
    Object.setPrototypeOf(v, Vec2Cls.prototype)
    return v as unknown as Vec2
  },
  from(v: InputVec2): Vec2 {
    return vec2(v[0], v[1])
  },
}

interface Vec2Cls {
  0: number
  1: number
  length: 2
}
class Vec2Cls extends Array {
  // Patch default string format.
  static name = 'Vec'

  add(v: InputVec2) {
    return v2.via(v2.add(this, v))
  }

  subtract(v: InputVec2) {
    return v2.via(v2.subtract(this, v))
  }

  scale(f: number) {
    return vec2(this[0] * f, this[1] * f)
  }

  invert() {
    return vec2(-this[0], -this[1])
  }

  mod(mod: InputVec2) {
    return vec2(posMod(this[0], mod[0]), posMod(this[1], mod[1]))
  }

  lerp(to: InputVec2, f: number) {
    return vec2(
      this[0] + f * (to[0] - this[0]),
      this[1] + f * (to[1] - this[1]),
    )
  }

  min(v: InputVec2): Vec2 {
    return v2.via(v2.min(this, v))
  }

  max(v: InputVec2): Vec2 {
    return v2.via(v2.max(this, v))
  }

  get isZero(): boolean {
    return !this[0] && !this[1]
  }

  get len(): number {
    return v2.len(this)
  }

  get taxiLen(): number {
    return v2.taxiLen(this)
  }

  equals(v: InputVec2): boolean {
    return this[0] === v[0] && this[1] === v[1]
  }

  inArea(min: InputVec2, max: InputVec2): boolean
  inArea(max: InputVec2): boolean
  inArea(min: InputVec2, max?: InputVec2): boolean {
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
}

export class Vec2Set extends VecSet<Vec2> {
  constructor(vecs?: Iterable<Vec2>) {
    super(vecs, v2.via)
  }
}

function vec2(x = 0, y = 0): Vec2 {
  // @ts-expect-error TS does not support the overloaded ArrayConstructor with multiple arguments for the array items.
  return new Vec2Cls(x, y)
}
export default Object.assign(vec2, v2)
