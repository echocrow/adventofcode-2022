import io from '#lib/io.js'
import {count, map, range, reduce} from '#lib/iterable.js'

class Brick {
  readonly supports: Brick[] = []
  rests = 0
  constructor(
    public readonly x: number,
    public readonly y: number,
    public z0: number,
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
  brick.rests += collisions.length
  settled.push(brick)
}

io.write(count(bricks, (b) => b.supports.every((b2) => b2.rests > 1)))
