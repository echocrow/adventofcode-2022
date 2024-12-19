import io from '#lib/io.js'

const towels = ((await io.readLine()) ?? '')
  .split(', ')
  .sort((a, b) => a.length - b.length)

function canCombine(target: string) {
  if (!target) return true
  for (const towel of towels) {
    if (!target.startsWith(towel)) continue
    if (canCombine(target.slice(towel.length))) return true
  }
  return false
}

let result = 0
for await (const line of io.readLines()) {
  if (!line) continue
  if (canCombine(line)) result++
}

io.write(result)
