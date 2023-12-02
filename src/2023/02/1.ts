import IO from 'lib/io.js'

const io = new IO()

const maxBalls = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
])

let result = 0
for await (const line of io.readLines()) {
  const [_, gameId, game] = /^Game (\d+): (.+)$/.exec(line) ?? []
  const possible = [...(game?.matchAll(/(\d+) ([a-z]+)/g) ?? [])].every(
    ([_, count, color]) => Number(count) <= (maxBalls.get(color ?? '') ?? 0),
  )
  if (possible) result += Number(gameId)
}

io.write(result)
