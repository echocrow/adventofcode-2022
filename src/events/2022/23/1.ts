import io from '#lib/io.js'
import vec, {type Vec2, VecSet} from '#lib/vec.legacy.js'

// Set up rules.
const dirs = {
  N: vec(0, -1),
  NW: vec(-1, -1),
  NE: vec(1, -1),
  W: vec(-1, 0),
  E: vec(1, 0),
  S: vec(0, 1),
  SW: vec(-1, 1),
  SE: vec(1, 1),
}
type Rule = [Vec2, Vec2[]]
const rules: Rule[] = [
  [dirs.N, [dirs.N, dirs.NW, dirs.NE]],
  [dirs.S, [dirs.S, dirs.SW, dirs.SE]],
  [dirs.W, [dirs.W, dirs.NW, dirs.SW]],
  [dirs.E, [dirs.E, dirs.NE, dirs.SE]],
]

// Parse.
let elves = new VecSet<Vec2>()
{
  let y = 0
  for await (const line of io.readLines()) {
    for (let x = 0; x < line.length; x++)
      if (line[x] === '#') elves.add(vec(x, y))
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
  const nextElves = new VecSet<Vec2>()
  for (const pos of elves) {
    // Eval rules for elf.
    const okRules = [...roundRules(r)].filter((rule) => testRule(pos, rule))
    let move =
      okRules.length > 0 && okRules.length < rules.length ?
        okRules[0]![0]
      : vec()
    let goto = pos.add(move)

    // Check if preferred spot is taken.
    if (nextElves.has(goto)) {
      nextElves.delete(goto)
      nextElves.add(goto.add(move))
      goto = pos
      move = vec()
    }

    nextElves.add(goto)
  }
  elves = nextElves
}

const elfCoors = [...elves]
const [minX, minY] = elfCoors.reduce(vec.min)
const [maxX, maxY] = elfCoors.reduce(vec.max)
const mapSize = (maxX - minX + 1) * (maxY - minY + 1)
const emptySpots = mapSize - elfCoors.length

io.write(emptySpots)
