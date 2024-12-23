import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'
import vec from '#lib/vec.legacy.js'

const nextRockShape = (() => {
  const shapes = [
    new Uint8Matrix([1, 1, 1, 1], 4),
    new Uint8Matrix([0, 1, 0, 1, 1, 1, 0, 1, 0], 3),
    new Uint8Matrix([1, 1, 1, 0, 0, 1, 0, 0, 1], 3),
    new Uint8Matrix([1, 1, 1, 1], 1),
    new Uint8Matrix([1, 1, 1, 1], 2),
  ]
  let s = -1
  return () => {
    s = (s + 1) % shapes.length
    return shapes[s]!
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
        yield vec(this.x + rx, this.y + ry)
      }
    }
  }
}

const nextWind = await (async () => {
  const dirs = new Int8Array(
    ((await io.readLine()) ?? '').split('').map((c) => (c === '>' ? 1 : -1)),
  )
  let d = -1
  return () => {
    d = (d + 1) % dirs.length
    return dirs[d]!
  }
})()

class Tower {
  data: Uint8Matrix
  top = 0

  constructor(width: number, initHeight = 128) {
    this.data = new Uint8Matrix(width * initHeight, width)
  }

  addRock(rock: Rock) {
    const newHeight = rock.y + rock.shape.height
    if (newHeight >= this.data.height)
      this.data.pushRow(new Uint8Array(this.data.length))
    for (const [x, y] of rock.rockBits()) this.data.setCell(x, y, 1)
    this.top = Math.max(this.top, rock.y + rock.shape.height)
  }

  canFit(rock: Rock) {
    if (rock.x < 0 || rock.x + rock.shape.width > this.data.width) return false
    if (rock.y < 0) return false
    for (const [x, y] of rock.rockBits())
      if (y < this.data.height && this.data.cell(x, y)) return false
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
let map = new Tower(7)

const ROCKS = 2022
let rock = new Rock(new Uint8Matrix(), 0, 0)
for (let r = 0; r < ROCKS; r++) {
  rock.shape = nextRockShape()
  rock.x = 2
  rock.y = map.top + 3
  while (true) {
    // Check wind.
    map.tryMove(rock, nextWind())
    // Check fall.
    if (!map.tryMove(rock, 0, -1)) {
      map.addRock(rock)
      break
    }
  }
}

io.write(map.top)

// async function draw(rock?: Rock) {
//   io.clearLog()
//   let drawMap = new Map(map.data.width, map.data.height)
//   drawMap.data.set(map.data)
//   if (rock) drawMap.addRock(rock)
//   let lines: string[] = []
//   for (const row of drawMap.data.rows()) {
//     const txt = row.join('').replaceAll('0', ' ').replaceAll('1', '#')
//     lines.push(`|${txt}|`)
//   }
//   io.log(lines.reverse().join('\n'))
//   await io.sleep(0.2)
// }
