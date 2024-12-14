import io from '#lib/io.js'
import {joinRegExps} from '#lib/string.js'

// # Explanation
//
// The equations to solve for `a` and `b` are near identical to part 1. However,
// this time we need to add `pd` to `px` and `py`.
//
// Solving for `a`, we need to update `px` and `py`, adding `+ pd` to each.
// Before:
//   a = ((px * by) - (py * bx)) / (((ax * by) - (ay * bx)))
// After:
//   a = (((px + pd) * by) - ((py + pd) * bx)) / (((ax * by) - (ay * bx)))
//
// Here, `pd` is a large number; adding and multiplying will yield even larger
// numbers. As a small optimization, we can simplify the updated dividend to
// keep intermediary numbers as much as possible:
//   ((px + pd) * by) - ((py + pd) * bx)
//   ((px * by) + (pd * by)) - ((py * bx) + (pd * bx))
//   (px * by) + (pd * by) - (py * bx) - (pd * bx)
//   (px * by) - (py * bx) + (pd * by) - (pd * bx)
//   (px * by) - (py * bx) + (pd * (by - bx))
// Updated equation:
//   a = ((px * by) - (py * bx) + (pd * (by - bx))) / (((ax * by) - (ay * bx)))
//
// Given `a`, solve for `b` just like in part 1, but again adding `pd`.
//   b = ((px + pd) - (ax * a)) / bx

const COST_A = 3
const COST_B = 1

const pd = 10_000_000_000_000

const aRe = /^Button A: X\+(\d+), Y\+(\d+)$/
const bRe = /^Button B: X\+(\d+), Y\+(\d+)$/
const pRe = /^Prize: X=(\d+), Y=(\d+)$/
const re = joinRegExps([aRe, bRe, pRe], '\n', 'm')

let result = 0
for await (const match of io.readRegExp(re)) {
  let [, ax = 0, ay = 0, bx = 0, by = 0, px = 0, py = 0] = match.map(Number)

  const a = (px * by - py * bx + pd * (by - bx)) / (ax * by - ay * bx)
  if (!Number.isSafeInteger(a)) continue

  const b = (px + pd - ax * a) / bx
  if (!Number.isSafeInteger(b)) continue

  result += a * COST_A + b * COST_B
}

io.write(result)
