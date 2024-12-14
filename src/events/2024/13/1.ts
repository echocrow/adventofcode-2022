import io from '#lib/io.js'
import {joinRegExps} from '#lib/string.js'

// # Explanation
//
// We need to solve for `a` and `b` for the following equations:
//   (ax * a) + (bx * b) = px
//   (ay * a) + (by * b) = py
//
// Multiply equation 1 by `by` and 2 by `bx`, so `b` cancels out when
// subtracting them:
//     (ax * by * a) + (bx * by * b) = px * by
//   - (ay * bx * a) + (by * bx * b) = py * bx
//     =======================================
//     (ax * by * a) - (ay * bx * a) = (px * by) - (py * bx)
//
// (Note: Instead of multiply by `by` and `bx`, we could also multiply by the
// quotient of `LCM(bx, by) / bx` and `... / by` respectively. This *might* help
// avoiding large numbers, but does not seem to be necessary.)
//
// Rearrange to solve for `a`:
//   (ax * by) * a - (ay * bx) * a = (px * by) - (py * bx)
//   ((ax * by) - (ay * bx)) * a = (px * by) - (py * bx)
//   a = ((px * by) - (py * bx)) / (((ax * by) - (ay * bx)))
//
// Using the first equation, solve for `b` (now given `a`):
//   (ax * a) + (bx * b) = px
//   (bx * b) = px - (ax * a)
//   b = (px - (ax * a)) / bx

const COST_A = 3
const COST_B = 1

const aRe = /^Button A: X\+(\d+), Y\+(\d+)$/
const bRe = /^Button B: X\+(\d+), Y\+(\d+)$/
const pRe = /^Prize: X=(\d+), Y=(\d+)$/
const re = joinRegExps([aRe, bRe, pRe], '\n', 'm')

let result = 0
for await (const match of io.readRegExp(re)) {
  const [, ax = 0, ay = 0, bx = 0, by = 0, px = 0, py = 0] = match.map(Number)

  const a = (px * by - py * bx) / (ax * by - ay * bx)
  if (!Number.isSafeInteger(a)) continue

  const b = (px - ax * a) / bx
  if (!Number.isSafeInteger(b)) continue

  result += a * COST_A + b * COST_B
}

io.write(result)
