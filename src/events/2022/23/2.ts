import io from '#lib/io.js'
import vec, {type Vec2, VecSet} from '#lib/vec.js'

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
let noMoves = 0
let round = 0
while (noMoves <= rules.length) {
  let moved = false
  const nextElves = new VecSet<Vec2>()
  for (const pos of elves) {
    // Eval rules for elf.
    const okRules = [...roundRules(round)].filter((rule) => testRule(pos, rule))
    let move =
      okRules.length > 0 && okRules.length < rules.length ?
        okRules[0]![0]
      : vec()
    let goto = pos.add(move)

    // Check if preferred spot is taken.
    if (nextElves.has(goto)) {
      nextElves.delete(goto)
      nextElves.add(move ? goto.add(move) : goto)
      goto = pos
      move = vec()
    }

    nextElves.add(goto)
    moved = moved || !move.isZero
  }
  if (!moved) noMoves++
  else noMoves = 0

  elves = nextElves
  round++
}
const roundsUntilNoMove = round - rules.length

io.write(roundsUntilNoMove)
