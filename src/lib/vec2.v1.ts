import {posMod} from './math.js'

export type mutVec2 = [number, number]
export type vec2 = readonly [number, number]

export const zeroVec2: vec2 = [0, 0]

export function addVec2(a: vec2, b: vec2): vec2 {
  return [a[0] + b[0], a[1] + b[1]]
}

export function subtractVec2(a: vec2, b: vec2): vec2 {
  return [a[0] - b[0], a[1] - b[1]]
}

export function scaleVec2(vec: vec2, f: number): vec2 {
  return [vec[0] * f, vec[1] * f]
}
export function invertVec2(vec: vec2): vec2 {
  return scaleVec2(vec, -1)
}

export function modVec2(v: vec2, mod: vec2): vec2 {
  return [posMod(v[0], mod[0]), posMod(v[1], mod[1])]
}

export function equalsVec(a: vec2, b: vec2): boolean {
  return a[0] === b[0] && a[1] === b[1]
}

export function lerpVec2(a: vec2, b: vec2, f: number): vec2 {
  return [a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1])]
}

export function minVec2(a: vec2, b: vec2): vec2 {
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1])]
}

export function maxVec2(a: vec2, b: vec2): vec2 {
  return [Math.max(a[0], b[0]), Math.max(a[1], b[1])]
}

export function lenVec2(v: vec2): number {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2)
}

/** Calculate taxicab/manhattan length of a vector. */
export function taxiLenVec2(v: vec2): number {
  return Math.abs(v[0]) + Math.abs(v[1])
}
/** Calculate taxicab/manhattan distance between two vectors. */
export function taxiDistVec2(a: vec2, b: vec2): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

export function* rangeVec2(from: vec2, to: vec2, inclusive = false) {
  const d = subtractVec2(to, from)
  const steps = Math.max(Math.abs(d[0]), Math.abs(d[1]))
  for (let i = 0; i < steps; i++) {
    yield lerpVec2(from, to, i / steps)
  }
  if (inclusive) yield to
}

export function fmtVec2(v: vec2) {
  return `${v[0]},${v[1]}`
}
export function parseVec2(s: string): vec2 {
  const [x = '', y = ''] = s.split(',')
  return [Number(x), Number(y)]
}

export function inAreaVec2(min: vec2, max: vec2, p: vec2): boolean {
  return p[0] >= min[0] && p[1] >= min[1] && p[0] < max[0] && p[1] < max[1]
}

export class Vec2Set {
  #set = new Set<string>()

  constructor(vecs?: Iterable<vec2>) {
    for (const v of vecs ?? []) this.add(v)
  }

  add(v: vec2) {
    this.#set.add(this.encode(v))
  }
  delete(v: vec2) {
    this.#set.delete(this.encode(v))
  }
  has(v: vec2) {
    return this.#set.has(this.encode(v))
  }
  get size() {
    return this.#set.size
  }
  *[Symbol.iterator]() {
    for (const s of this.#set) yield this.decode(s)
  }

  encode(v: vec2) {
    return fmtVec2(v)
  }
  decode(s: string) {
    return parseVec2(s)
  }
}
export class Vec2MemoSet extends Vec2Set {
  #coords = new Map<string, vec2>()

  encode(v: vec2) {
    const s = super.encode(v)
    if (!this.#coords.has(s)) this.#coords.set(s, v)
    return s
  }
  decode(s: string) {
    const storedV = this.#coords.get(s)
    if (storedV) return storedV
    const v = super.decode(s)
    this.#coords.set(s, v)
    return v
  }
}
