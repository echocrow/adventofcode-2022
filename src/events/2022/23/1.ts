import io from '#lib/io.js'
import vec2, {type Vec2, Vec2Set} from '#lib/vec2.js'

// Set up rules.
const dirs = {
  N: vec2(0, -1),
  NW: vec2(-1, -1),
  NE: vec2(1, -1),
  W: vec2(-1, 0),
  E: vec2(1, 0),
  S: vec2(0, 1),
  SW: vec2(-1, 1),
  SE: vec2(1, 1),
}
type Rule = [Vec2, Vec2[]]
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
    for (let x = 0; x < line.length; x++)
      if (line[x] === '#') elves.add(vec2(x, y))
    y++
  }
}

// Helpers to determine rules.
function* roundRules(roundNum: number) {
  for (let i = 0; i < rules.length; i++)
    yield rules[(roundNum + i) % rules.length]!
}
function testRule(pos: Vec2, [_, checks]: Rule) {
  return !checks.some((check) => elves.has(pos.add(check)))
}

// Play rounds.
const ROUNDS = 10
for (let r = 0; r < ROUNDS; r++) {
  const nextElves = new Vec2Set()
  for (const pos of elves) {
    // Eval rules for elf.
    const okRules = [...roundRules(r)].filter((rule) => testRule(pos, rule))
    let move =
      okRules.length > 0 && okRules.length < rules.length ?
        okRules[0]![0]
      : vec2()
    let goto = pos.add(move)

    // Check if preferred spot is taken.
    if (nextElves.has(goto)) {
      nextElves.delete(goto)
      nextElves.add(goto.add(move))
      goto = pos
      move = vec2()
    }

    nextElves.add(goto)
  }
  elves = nextElves
}

const elfCoors = [...elves]
const [minX, minY] = elfCoors.reduce(vec2.min)
const [maxX, maxY] = elfCoors.reduce(vec2.max)
const mapSize = (maxX - minX + 1) * (maxY - minY + 1)
const emptySpots = mapSize - elfCoors.length

io.write(emptySpots)
