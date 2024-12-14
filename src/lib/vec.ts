import {vec2, type Vec2} from './vec2.js'
import {parseVec3, Vec3} from './vec3.js'

export type {Vec2, Vec3}

function vec(x?: number, y?: number): Vec2
function vec(x?: number, y?: number, z?: number): Vec3
function vec(a?: number, b?: number, c?: number): Vec2 | Vec3 {
  return arguments.length === 3 ? new Vec3(a ?? 0, b ?? 0, c ?? 0) : vec2(a, b)
}
function vecParse(s: string): Vec2 | Vec3 {
  return vec(...s.split(',').map(Number))
}
vec.parse2 = vec2.parse
vec.parse3 = parseVec3
export default vec

export class VecSet<TVec extends Vec2 | Vec3 = Vec2 | Vec3> {
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
  *[Symbol.iterator]() {
    for (const s of this.#set) yield this.#decode(s)
  }

  #encode(v: TVec) {
    return v.fmt()
  }
  #decode(s: string) {
    return vecParse(s)
  }
}
