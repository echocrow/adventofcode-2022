import io from '#lib/io.js'
import {strRec} from '#lib/types.js'

const ROBOTS = 2

const enum BTN {
  A = 1,
  U,
  D,
  L,
  R,
  N0,
  N1,
  N2,
  N3,
  N4,
  N5,
  N6,
  N7,
  N8,
  N9,
  MAX = BTN.N9,
}

const DPAD: [number, number][] = [
  [0, 0], // NULL
  [2, 0], // A
  [1, 0], // U
  [1, 1], // D
  [0, 1], // L
  [2, 1], // R
]
const NUMPAD: [number, number][] = [
  [0, 3], // NULL
  [2, 3], // A
  ...DPAD.slice(BTN.A + 1).map((_) => null as never),
  [1, 3], // 0
  [0, 2], // 1
  [1, 2], // 2
  [2, 2], // 3
  [0, 1], // 4
  [1, 1], // 5
  [2, 1], // 6
  [0, 0], // 7
  [1, 0], // 8
  [2, 0], // 9
]

const BTNS = strRec({
  '0': BTN.N0,
  '1': BTN.N1,
  '2': BTN.N2,
  '3': BTN.N3,
  '4': BTN.N4,
  '5': BTN.N5,
  '6': BTN.N6,
  '7': BTN.N7,
  '8': BTN.N8,
  '9': BTN.N9,
  A: BTN.A,
})

function* getMoveOpts(layout: [number, number][], from: number, to: number) {
  const [fromX, fromY] = layout[from]!
  const [toX, toY] = layout[to]!
  const xSteps = toX - fromX
  const ySteps = toY - fromY

  const xBtns = Array(Math.abs(xSteps)).fill(xSteps > 0 ? BTN.R : BTN.L)
  const yBtns = Array(Math.abs(ySteps)).fill(ySteps > 0 ? BTN.D : BTN.U)

  const [nilX, nilY] = layout[0]!
  const hFirstOk = fromY !== nilY || toX !== nilX
  const vFirstOk = fromX !== nilX || toY !== nilY

  if (hFirstOk) yield [...xBtns, ...yBtns, BTN.A]
  if (vFirstOk) yield [...yBtns, ...xBtns, BTN.A]
}

const maxDepth = ROBOTS + 1
const cache: number[] = []
function evalMoveLen(from: number, to: number, depth = 0): number {
  if (depth >= maxDepth) return 1

  const cacheId = (from * BTN.MAX + to) * maxDepth + depth
  const cached = cache[cacheId]
  if (cached !== undefined) return cached

  const layout = depth ? DPAD : NUMPAD
  depth++
  let min = Infinity
  for (const steps of getMoveOpts(layout, from, to)) {
    min = Math.min(min, evalMovesLen(steps, depth))
  }
  cache[cacheId] = min
  return min
}
function evalMovesLen(btns: number[], depth = 0): number {
  let len = 0
  let curr = BTN.A
  for (const btn of btns) {
    len += evalMoveLen(curr, (curr = btn), depth)
    curr = btn
  }
  return len
}

let result = 0
for await (const line of io.readLines()) {
  const chars = [...line]
  const numCode = chars.reduce((acc, c) => (c !== 'A' ? acc * 10 + +c : acc), 0)
  const btns = chars.map((b) => BTNS[b]!)
  const movesLen = evalMovesLen(btns)
  result += movesLen * numCode
}

io.write(result)
