import io from '#lib/io.js'
import sum from '#lib/sum.js'

const counts = [] as number[]
const fixtures = new Uint8Array((await io.peekLine())!.length)
let y = 0
for await (const line of io.readLines()) {
  counts.push(0)
  for (let x = 0; x < line.length; x++) {
    const char = line[x]
    if (char === '#') fixtures[x] = y + 1
    if (char === 'O') counts[fixtures[x]++]++
  }
  y++
}

const result = sum(counts.map((count, y) => count * (counts.length - y)))
io.write(result)
