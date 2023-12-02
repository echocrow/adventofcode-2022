import io from 'lib/io.js'

const scores = {
  win: 6,
  draw: 3,
}

type Item = 'rock' | 'paper' | 'scissors'

const items = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
  X: 'rock',
  Y: 'paper',
  Z: 'scissors',
} satisfies Record<string, Item>
type ItemKey = keyof typeof items

const outcomes: Record<Item, Partial<Record<Item, number>>> = {
  rock: {
    rock: scores.draw,
    paper: scores.win,
  },
  paper: {
    paper: scores.draw,
    scissors: scores.win,
  },
  scissors: {
    rock: scores.win,
    scissors: scores.draw,
  },
}

const itemScores: Record<Item, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
}

let score = 0
for await (const line of io.readLines()) {
  const [oppItmKey, myItmKey] = line.split(' ') as [ItemKey, ItemKey]
  const oppItm = items[oppItmKey]
  const myItm = items[myItmKey]

  score += outcomes[oppItm][myItm] ?? 0
  score += itemScores[myItm] ?? 0
}

io.write(score)
