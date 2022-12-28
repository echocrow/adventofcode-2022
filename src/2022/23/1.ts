import IO from 'lib/io.js'
import {addVec2, maxVec2, minVec2, vec2, Vec2Set, zeroVec2} from 'lib/vec2.js'

const io = new IO()

// Set up rules.
const dirs = {
  N: [0, -1],
  NW: [-1, -1],
  NE: [1, -1],
  W: [-1, 0],
  E: [1, 0],
  S: [0, 1],
  SW: [-1, 1],
  SE: [1, 1],
} satisfies Record<string, vec2>
type Rule = [vec2, vec2[]]
const rules: Rule[] = [
  [dirs.N, [dirs.N, dirs.NW, dirs.NE]],
  [dirs.S, [dirs.S, dirs.SW, dirs.SE]],
  [dirs.W, [dirs.W, dirs.NW, dirs.SW]],
  [dirs.E, [dirs.E, dirs.NE, dirs.SE]],
]

// Parse.
let elves = new Vec2Set()
{
  let y = 0
  for await (const line of io.readLines()) {
    for (let x = 0; x < line.length; x++) if (line[x] === '#') elves.add([x, y])
    y++
  }
}

// Helpers to determine rules.
function* roundRules(roundNum: number) {
  for (let i = 0; i < rules.length; i++)
    yield rules[(roundNum + i) % rules.length]!
}
function testRule(pos: vec2, [_, checks]: Rule) {
  return !checks.some((check) => elves.has(addVec2(pos, check)))
}

// Play rounds.
const ROUNDS = 10
for (let r = 0; r < ROUNDS; r++) {
  const nextElves = new Vec2Set()
  for (const pos of elves) {
    // Eval rules for elf.
    const okRules = [...roundRules(r)].filter((rule) => testRule(pos, rule))
    let move: vec2 =
      okRules.length > 0 && okRules.length < rules.length
        ? okRules[0]![0]
        : zeroVec2
    let goto = addVec2(pos, move)

    // Check if preferred spot is taken.
    if (nextElves.has(goto)) {
      nextElves.delete(goto)
      nextElves.add(addVec2(goto, move))
      goto = pos
      move = zeroVec2
    }

    nextElves.add(goto)
  }
  elves = nextElves
}

const elfCoors = [...elves]
const [minX, minY] = elfCoors.reduce(minVec2)
const [maxX, maxY] = elfCoors.reduce(maxVec2)
const mapSize = (maxX - minX + 1) * (maxY - minY + 1)
const emptySpots = mapSize - elfCoors.length

io.write(emptySpots)
