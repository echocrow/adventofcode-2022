import io from '#lib/io.js'

const minArea = Number((await io.readCfgLine('__minArea')) ?? 200000000000000)
const maxArea = Number((await io.readCfgLine('__maxArea')) ?? 400000000000000)

type Stone = [x: number, y: number, vx: number, vy: number]

const stones: Stone[] = []
for await (const line of io.readLines())
  stones.push(
    line
      .split('@')
      .flatMap((s) => s.split(', ', 2))
      .map(Number) as Stone,
  )

let result = 0
for (let s0 = 0; s0 < stones.length; s0++)
  for (let s1 = s0 + 1; s1 < stones.length; s1++)
    result += +intersects(stones[s0]!, stones[s1]!)

io.write(result)

function intersects(stone0: Stone, stone1: Stone) {
  const [x0, y0, vx0, vy0] = stone0
  const [x1, y1, vx1, vy1] = stone1
  const s0 = vy0 / vx0
  const s1 = vy1 / vx1
  // Ensure trajectories are not parallel.
  if (s0 === s1) return false
  const x = (y1 - y0 + s0 * x0 - s1 * x1) / (s0 - s1)
  // Ensure `x` is within the area.
  if (x < minArea || x > maxArea) return false
  // Ensure intersection in the future for both stones.
  if ((vx0 > 0 && x < x0) || (vx0 < 0 && x > x0)) return false
  if ((vx1 > 0 && x < x1) || (vx1 < 0 && x > x1)) return false
  // Ensure `y` is within the area.
  const y = (x - x0) * s0 + y0
  return y >= minArea && y <= maxArea
}

/**
 * **Explanation:**
 *
 * Trajectory of a hailstone (`s`) can be expressed as a linear x-y equation:
 * ```
 * y = (x - s.x) * (s.vy / s.vx) + s.y
 * ```
 *
 * Given two stones (`a`, `b`), we can find their intersection point by pairing
 * their equations for `y` and solving for `x`:
 * ```
 * (x - a.x) * (a.vy / a.vx) + a.y = (x - b.x) * (b.vy / b.vx) + b.y
 * ```
 *
 * This simplifies to:
 * ```
 *     b.y - a.y + (a.vy / vx0) * a.x - (b.vy / vx1) * x1
 * x = --------------------------------------------------
 *                  a.vy / a.vx - b.vy / vx1
 * ```
 *
 * Afterwards, given `x`, we can calculate `y` by substituting `x` in the
 * original trajectory equation.
 */
