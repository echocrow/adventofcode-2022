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
  const isOk = nums.every((num, i) =>
    nums.slice(0, i).every((left) => !rules[num]?.has(left)),
  )
  if (isOk) result += nums[(nums.length / 2) | 0]!
}

io.write(result)
