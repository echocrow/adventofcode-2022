import io from '#lib/io.js'
import {fifo, map, range, reduce} from '#lib/iterable.js'
import {isSuperSet} from '#lib/set.js'

class Brick {
  readonly supports: Brick[] = []
  readonly restsOn: Brick[] = []
  constructor(
    /** Bitmask of x cubes. */
    public readonly x: number,
    /** Bitmask of y cubes. */
    public readonly y: number,
    /** Start of z cubes. */
    public z0: number,
    /** Count of z cubes (one removed). */
    public readonly zLen: number,
  ) {}
  get z1() {
    return this.z0 + this.zLen
  }
  lower(dz = 1) {
    this.z0 -= dz
  }
  touches(brick: Brick): boolean {
    if (this.z0 > brick.z1 || this.z1 < brick.z0) return false
    return !!(this.x & brick.x && this.y & brick.y)
  }
  touchesFloor(): boolean {
    return this.z0 === 1
  }
}

// Parse bricks.
const bricks: Brick[] = []
const nums = /\d+/g
for await (const line of io.readLines()) {
  const [x0, y0, z0, x1, y1, z1] = map(line.matchAll(nums), Number)
  const x = reduce(range(x0!, x1!, true), (v, p) => v | (1 << p), 0)
  const y = reduce(range(y0!, y1!, true), (v, p) => v | (1 << p), 0)
  bricks.push(new Brick(x, y, z0!, z1! - z0!))
}
// Sort by z position.
bricks.sort((a, b) => a.z0 - b.z0)

// Drop bricks, check for collisions, and store supports.
const settled: Brick[] = []
for (const brick of bricks) {
  const collisions: Brick[] = []
  while (!brick.touchesFloor() && !collisions.length) {
    brick.lower()
    // Check collision.
    for (const landedBrick of settled)
      if (brick.touches(landedBrick)) collisions.push(landedBrick)
  }
  if (collisions.length) brick.lower(-1)
  for (const b of collisions) b.supports.push(brick)
  brick.restsOn.push(...collisions)
  settled.push(brick)
}

// Count cascading bricks for every brick.
let result = 0
for (const root of bricks) {
  const removed = new Set<Brick>()
  const removing = [root]
  for (const brick of fifo(removing)) {
    removed.add(brick)
    for (const b of brick.supports)
      if (isSuperSet(removed, b.restsOn)) removing.push(b)
  }
  result += removed.size - 1
}
io.write(result)
