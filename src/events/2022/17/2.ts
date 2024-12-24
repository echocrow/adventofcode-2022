import io from '#lib/io.js'
import {lcm} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'
import vec from '#lib/vec.js'

const rockShapes = (() => {
  const shapes = [
    new Uint8Matrix([1, 1, 1, 1], 4),
    new Uint8Matrix([0, 1, 0, 1, 1, 1, 0, 1, 0], 3),
    new Uint8Matrix([1, 1, 1, 0, 0, 1, 0, 0, 1], 3),
    new Uint8Matrix([1, 1, 1, 1], 1),
    new Uint8Matrix([1, 1, 1, 1], 2),
  ]
  let s = -1
  return {
    length: shapes.length,
    next() {
      s = (s + 1) % shapes.length
      return shapes[s]!
    },
  }
})()

class Rock {
  constructor(
    public shape: Uint8Matrix,
    public x: number,
    public y: number,
  ) {}

  *rockBits() {
    for (let r = 0; r < this.shape.length; r++) {
      if (this.shape.$[r]) {
        const rx = r % this.shape.width
        const ry = (r - rx) / this.shape.width
        yield vec([this.x + rx, this.y + ry])
      }
    }
  }
}

const wind = await (async () => {
  const dirs = new Int8Array(
    ((await io.readLine()) ?? '').split('').map((c) => (c === '>' ? 1 : -1)),
  )
  let d = -1
  return {
    length: dirs.length,
    next() {
      d = (d + 1) % dirs.length
      return dirs[d]!
    },
  }
})()

class Tower {
  buffer: Uint8Matrix
  bufferTop = 0
  trimmed = 0n
  colTops: Uint16Array

  constructor(width: number, initHeight = 32) {
    this.buffer = new Uint8Matrix(width * initHeight, width)
    this.colTops = new Uint16Array(width)
  }

  get height() {
    return this.trimmed + BigInt(this.bufferTop)
  }

  addRock(rock: Rock) {
    const newHeight = rock.y + rock.shape.height
    if (newHeight >= this.buffer.height)
      this.buffer.pushRow(new Uint8Array(this.buffer.length))
    for (const [x, y] of rock.rockBits()) {
      this.buffer.setCell(x, y, 1)
      this.colTops[x] = Math.max(this.colTops[x]!, y)
    }
    this.bufferTop = Math.max(this.bufferTop, rock.y + rock.shape.height)
    const trimRows = this.buffer.height > 1024 ? Math.min(...this.colTops) : 0
    if (trimRows) {
      this.buffer = this.buffer.sliceRows(trimRows)
      this.trimmed += BigInt(trimRows)
      this.bufferTop -= trimRows
      this.colTops.map
      for (let x = 0; x < this.colTops.length; x++) this.colTops[x]! -= trimRows
    }
  }

  canFit(rock: Rock) {
    if (rock.x < 0 || rock.x + rock.shape.width > this.buffer.width)
      return false
    if (rock.y < 0) return false
    for (const [x, y] of rock.rockBits())
      if (y < this.buffer.height && this.buffer.cell(x, y)) return false
    return true
  }

  tryMove(rock: Rock, dx = 0, dy = 0) {
    rock.x += dx
    rock.y += dy
    if (this.canFit(rock)) return true
    rock.x -= dx
    rock.y -= dy
    return false
  }
}

// Attempt to find a repeating cycle where rock & wind patterns repeat.
// This current approach is horrendously inefficient, but can get the job done
// after some crunching.
const cycleLen = lcm(rockShapes.length, wind.length)
const ROCK_POS_BIT_LEN = 3n
let map = new Tower(7)
let rock = new Rock(new Uint8Matrix(), 0, 0)
const snaps: bigint[] = []
const heights: bigint[] = []
let repeat = -1
while (true) {
  io.log(`Cycle ${snaps.length}`)
  let snap = 0n
  for (let c = 0; c < cycleLen; c++) {
    rock.shape = rockShapes.next()
    rock.x = 2
    rock.y = map.bufferTop + 3
    while (true) {
      // Check wind.
      map.tryMove(rock, wind.next())
      // Check fall.
      if (!map.tryMove(rock, 0, -1)) {
        map.addRock(rock)
        heights.push(map.height)
        break
      }
    }
    snap = (snap << ROCK_POS_BIT_LEN) | BigInt(rock.x)
  }
  repeat = snaps.indexOf(snap)
  if (repeat >= 0) break
  snaps.push(snap)
}

const repeatStart = repeat * cycleLen
const repeatLen = (snaps.length - repeat) * cycleLen
const baseHeight = heights[repeatStart - 1]!
const repeatHeight = heights[repeatStart + repeatLen - 1]! - baseHeight
const repeatHeights = heights
  .slice(repeatStart - 1, repeatStart + repeatLen)
  .map((h) => h - baseHeight)

function calcFullHeight(rocksCount: bigint): bigint {
  if (rocksCount < repeatStart) return heights[Number(rocksCount) - 1]!

  const repeatRocks = rocksCount - BigInt(repeatStart)
  const repeatOffset = repeatRocks % BigInt(repeatLen)
  const repeatCount = (repeatRocks - repeatOffset) / BigInt(repeatLen)

  return (
    baseHeight +
    repeatCount * repeatHeight +
    repeatHeights[Number(repeatOffset)]!
  )
}

const ROCKS = 1000000000000n
const height = calcFullHeight(ROCKS)

io.write(height.toString())
