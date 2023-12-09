import io from '#lib/io.js'

type Item = 'rock' | 'paper' | 'scissors'

const items = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
} satisfies Record<string, Item>
type ItemKey = keyof typeof items

const OpScores = {
  X: 0,
  Y: 3,
  Z: 6,
} as const
type Op = keyof typeof OpScores

const outcomes: Record<Item, Record<Op, Item>> = {
  rock: {
    X: 'scissors',
    Y: 'rock',
    Z: 'paper',
  },
  paper: {
    X: 'rock',
    Y: 'paper',
    Z: 'scissors',
  },
  scissors: {
    X: 'paper',
    Y: 'scissors',
    Z: 'rock',
  },
}

const itemScores: Record<Item, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
}

let score = 0
for await (const line of io.readLines()) {
  const [oppItmKey, myOp] = line.split(' ') as [ItemKey, Op]
  const oppItm = items[oppItmKey]
  const myItm = outcomes[oppItm][myOp]

  score += OpScores[myOp] ?? 0
  score += itemScores[myItm] ?? 0
}

io.write(score)
