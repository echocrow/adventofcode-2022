import io from '#lib/io.js'

let result = 0
for await (const line of io.readLines()) {
  const game = /(?<=: ).+/.exec(line)?.[0] ?? ''
  const minMax = new Map<string, number>()
  for (const [_, count, color = ''] of game.matchAll(/(\d+) ([a-z]+)/g))
    minMax.set(color, Math.max(minMax.get(color) ?? 0, Number(count)))
  result += [...minMax.values()].reduce((pwr, count) => pwr * count, 1)
}

io.write(result)
