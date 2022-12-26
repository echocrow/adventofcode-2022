export type vec2 = Readonly<[number, number]>

export function addVec2(a: Readonly<vec2>, b: Readonly<vec2>): vec2 {
  return [a[0] + b[0], a[1] + b[1]]
}

export function subtractVec2(a: Readonly<vec2>, b: Readonly<vec2>): vec2 {
  return [a[0] - b[0], a[1] - b[1]]
}

export function scaleVec2(a: Readonly<vec2>, f: number): vec2 {
  return [a[0] * f, a[1] * f]
}

export function equalsVec(a: Readonly<vec2>, b: Readonly<vec2>): boolean {
  return a[0] === b[0] && a[1] === b[1]
}

export function lerpVec2(
  a: Readonly<vec2>,
  b: Readonly<vec2>,
  f: number,
): vec2 {
  return [a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1])]
}

export function minVec2(a: Readonly<vec2>, b: Readonly<vec2>): vec2 {
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1])]
}

export function maxVec2(a: Readonly<vec2>, b: Readonly<vec2>): vec2 {
  return [Math.max(a[0], b[0]), Math.max(a[1], b[1])]
}

export function* rangeVec2(from: vec2, to: vec2, inclusive = false) {
  const d = subtractVec2(to, from)
  const steps = Math.max(Math.abs(d[0]), Math.abs(d[1]))
  for (let i = 0; i < steps; i++) {
    yield lerpVec2(from, to, i / steps)
  }
  if (inclusive) yield to
}

export function fmtVec2(v: Readonly<vec2>) {
  return `${v[0]},${v[1]}`
}
export function parseVec2(s: string): Readonly<vec2> {
  const [x = '', y = ''] = s.split(',')
  return [Number(x), Number(y)]
}

export function inAreaVec2(min: vec2, max: vec2, p: vec2): boolean {
  return p[0] >= min[0] && p[1] >= min[1] && p[0] <= max[0] && p[1] <= max[1]
}
