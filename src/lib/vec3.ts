export type vec3 = Readonly<[number, number, number]>

export const zeroVec3: vec3 = [0, 0, 0]

export function addVec3(a: vec3, b: vec3): vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export function subtractVec3(a: vec3, b: vec3): vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function scaleVec3(a: vec3, f: number): vec3 {
  return [a[0] * f, a[1] * f, a[2] * f]
}

export function equalsVec(a: vec3, b: vec3): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

export function minVec3(a: vec3, b: vec3): vec3 {
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2])]
}

export function maxVec3(a: vec3, b: vec3): vec3 {
  return [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])]
}

export function fmtVec3(v: vec3) {
  return `${v[0]},${v[1]},${v[2]}`
}
export function parseVec3(s: string): Readonly<vec3> {
  const [x = '', y = '', z = ''] = s.split(',')
  return [Number(x), Number(y), Number(z)]
}

export function inSpaceVec3(min: vec3, max: vec3, p: vec3): boolean {
  return (
    p[0] >= min[0] &&
    p[1] >= min[1] &&
    p[2] >= min[2] &&
    p[0] < max[0] &&
    p[1] < max[1] &&
    p[2] < max[2]
  )
}

export function* neighborsVec3(v: vec3) {
  const ns: vec3[] = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ]
  for (const n of ns) yield addVec3(v, n)
}

export function* validNeighborsVec3(v: vec3, dims: vec3) {
  const min = zeroVec3
  for (const n of neighborsVec3(v)) {
    if (inSpaceVec3(min, dims, n)) yield n
  }
}

export function vec3ToI(p: vec3, dims: vec3): number {
  return p[0] + p[1] * dims[0] + p[2] * dims[0] * dims[1]
}

export function iToVec3(i: number, dims: vec3): vec3 {
  const x = i % dims[0]
  i = (i - x) / dims[0]
  const y = i % dims[1]
  const z = (i - y) / dims[1]
  return [x, y, z]
}

export function* xColsMatrix3(dims: vec3) {
  const len = dims[0] * dims[1] * dims[2]
  for (let s = 0; s < len; s += dims[0]) {
    yield (function* () {
      for (let x = 0; x < dims[0]; x++) {
        yield s + x
      }
    })()
  }
}

export function* yColsMatrix3(dims: vec3) {
  const cnt = dims[0] * dims[2]
  for (let c = 0; c < cnt; c++) {
    const x = c % dims[0]
    const s = x + (c - x) * dims[1]
    yield (function* () {
      for (let y = 0; y < dims[1]; y++) {
        yield s + y * dims[0]
      }
    })()
  }
}

export function* zColsMatrix3(dims: vec3) {
  const cnt = dims[0] * dims[1]
  const len = cnt * dims[2]
  for (let c = 0; c < cnt; c++) {
    yield (function* () {
      for (let i = c; i < len; i += cnt) {
        yield i
      }
    })()
  }
}

export class Vec3Set {
  #set = new Set<string>()

  constructor(vecs?: Iterable<vec3>) {
    for (const v of vecs ?? []) this.add(v)
  }

  add(v: vec3) {
    this.#set.add(this.#encode(v))
  }
  delete(v: vec3) {
    this.#set.delete(this.#encode(v))
  }
  has(v: vec3) {
    return this.#set.has(this.#encode(v))
  }
  get size() {
    return this.#set.size
  }
  *[Symbol.iterator]() {
    for (const s of this.#set) yield this.#decode(s)
  }

  #encode(v: vec3) {
    return fmtVec3(v)
  }
  #decode(s: string) {
    return parseVec3(s)
  }
}
