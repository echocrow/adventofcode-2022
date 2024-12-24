export type Vec2 = [x: number, y: number]
export type ReadonlyVec2 = readonly [x: number, y: number]
export type Vec3 = [x: number, y: number, z: number]
export type ReadonlyVec3 = readonly [x: number, y: number, z: number]
export type Vec = Vec2 | Vec3
export type ReadonlyVec = ReadonlyVec2 | ReadonlyVec3

function vecFmt(v: ReadonlyVec): string {
  return v.join(',')
}
function vecParse<TVec extends Vec = Vec>(s: string): TVec {
  return s.split(',').map(Number) as TVec
}

function vec(v: Vec2): Vec2
function vec(v: Vec3): Vec3
function vec(v: Vec): Vec {
  return v
}
vec.fmt = vecFmt
vec.parse2 = vecParse as (s: string) => Vec2
vec.parse3 = vecParse as (s: string) => Vec3
export default vec

export class VecSet<TVec extends ReadonlyVec = ReadonlyVec> {
  #set = new Set<string>()

  constructor(
    vecs?: Iterable<TVec>,
    private parse = (v: ReadonlyVec & TVec) => v as TVec,
  ) {
    for (const v of vecs ?? []) this.add(v)
  }

  add(v: TVec) {
    this.#set.add(this.#encode(v))
  }
  delete(v: TVec) {
    this.#set.delete(this.#encode(v))
  }
  has(v: TVec) {
    return this.#set.has(this.#encode(v))
  }
  get size() {
    return this.#set.size
  }
  *[Symbol.iterator](): Generator<TVec, void, undefined> {
    for (const s of this.#set) yield this.#decode(s) as TVec
  }

  #encode(v: TVec) {
    return vecFmt(v)
  }
  #decode(s: string) {
    return this.parse(vecParse(s))
  }
}
