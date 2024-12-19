import io from '#lib/io.js'

const towels = ((await io.readLine()) ?? '').split(', ')

const cache = new Map<string, number>()
function countCombos(target: string) {
  if (!target) return 1
  if (cache.has(target)) return cache.get(target)!
  let combos = 0
  for (const towel of towels) {
    if (!target.startsWith(towel)) continue
    combos += countCombos(target.slice(towel.length))
  }
  cache.set(target, combos)
  return combos
}

let result = 0
for await (const line of io.readLines()) {
  if (!line) continue
  result += countCombos(line)
}

io.write(result)
