import {vec2, type Vec2} from './vec2.legacy.js'
import {parseVec3, Vec3} from './vec3.js'

export type {Vec2, Vec3}

export type Vec = Vec2 | Vec3

function vec(x?: number, y?: number): Vec2
function vec(x?: number, y?: number, z?: number): Vec3
function vec(a?: number, b?: number, c?: number): Vec {
  return arguments.length === 3 ? new Vec3(a ?? 0, b ?? 0, c ?? 0) : vec2(a, b)
}
function vecParse(s: string): Vec {
  return vec(...s.split(',').map(Number))
}
vec.parse2 = vec2.parse
vec.parse3 = parseVec3
vec.min = function min<TVec extends Vec>(a: TVec, b: TVec): TVec {
  return a.min(b) as TVec
}
vec.max = function max<TVec extends Vec>(a: TVec, b: TVec): TVec {
  return a.max(b) as TVec
}
export default vec

export class VecSet<TVec extends Vec = Vec> {
  #set = new Set<string>()

  constructor(vecs?: Iterable<TVec>) {
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
    return v.fmt()
  }
  #decode(s: string) {
    return vecParse(s)
  }
}
