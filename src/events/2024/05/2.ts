import io from '#lib/io.js'

const rules: Record<number, Set<number>> = {}
for await (const line of io.readLines()) {
  if (!line) break
  const [a = 0, b = 0] = line.split('|').map(Number)
  ;(rules[a] ??= new Set()).add(b)
}

let result = 0
for await (const line of io.readLines()) {
  const nums = line.split(',').map(Number)
  const sorted: number[] = []
  let wasCorrected = false
  for (const num of nums) {
    const needRight = rules[num]
    let idx = sorted.findIndex((n) => needRight?.has(n))
    if (idx >= 0) wasCorrected = true
    else idx = sorted.length
    sorted.splice(idx, 0, num)
  }
  if (wasCorrected) result += sorted[(sorted.length / 2) | 0]!
}

io.write(result)
