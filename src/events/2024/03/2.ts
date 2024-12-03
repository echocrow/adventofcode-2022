import io from '#lib/io.js'

const instructRegExp = /(?:mul\((\d+),(\d+)\)|(do|don't)\(\))/

let result = 0
let enabled = true
for await (const [_, a, b, inst] of io.readRegExp(instructRegExp)) {
  if (inst) enabled = inst === 'do'
  else if (enabled) result += Number(a) * Number(b)
}

io.write(result)
