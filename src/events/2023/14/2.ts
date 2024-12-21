import {allocArrLen} from '#lib/array.js'
import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'

const SPINS = Number((await io.readCfgLine('__spins')) ?? 1000000000)

enum Tile {
  Empty,
  Roll,
  Fixed,
}

let map = new Uint8Matrix()
for await (const line of io.readLines())
  map.pushRow(
    [...line].map((c) =>
      c === '#' ? Tile.Fixed
      : c === 'O' ? Tile.Roll
      : Tile.Empty,
    ),
  )

function dropNorth(map: Uint8Matrix) {
  for (let x = 0; x < map.width; x++) {
    let fixed = 0
    for (let y = 0; y < map.height; y++) {
      const piece = map.cell(x, y)!
      if (piece === Tile.Fixed) fixed = y + 1
      else if (piece === Tile.Roll) {
        if (fixed !== y) {
          map.setCell(x, fixed, piece)
          map.setCell(x, y, Tile.Empty)
        }
        fixed++
      }
    }
  }
  return map
}
function spin() {
  for (let i = 0; i < 4; i++) map = dropNorth(map).rotate()
}

function countRocks() {
  let result = 0
  let yFactor = map.height
  for (const row of map.rows()) {
    result += row.reduce((s, v) => s + +(v === Tile.Roll), 0) * yFactor
    yFactor--
  }
  return result
}

function getId() {
  let id = 0n
  for (const v of map.$) {
    if (v === Tile.Roll) id += 1n
    id *= 2n
  }
  return id
}

const cycleById = new Map<bigint, number>()
let resByCycle = new Uint32Array()
let loopStart = -1
let c
for (c = 0; c < SPINS; c++) {
  spin()
  const id = getId()
  if (cycleById.has(id)) {
    loopStart = cycleById.get(id)!
    break
  }
  cycleById.set(id, c)
  resByCycle = allocArrLen(resByCycle, c + 1)
  resByCycle[c] = countRocks()
}

const loopLen = loopStart >= 0 ? c - loopStart : 0
const endCycle = loopLen ? ((SPINS - 1 - loopStart) % loopLen) + loopStart : --c
io.write(resByCycle[endCycle])
