import intersect from '#lib/intersect.js'
import io from '#lib/io.js'

const LOWER_A_CODE = 'a'.charCodeAt(0)
const UPPER_A_CODE = 'A'.charCodeAt(0)
function getPriority(letter: string): number {
  const code = letter.charCodeAt(0)
  const offset = code >= LOWER_A_CODE ? -LOWER_A_CODE : -UPPER_A_CODE + 26
  return code + offset + 1
}

let total = 0
let queue: Array<Set<string>> = []
for await (const line of io.readLines()) {
  queue.push(new Set(line))
  if (queue.length === 3) {
    const [letter] = queue.reduce(intersect).values()
    if (letter) total += getPriority(letter)
    queue = []
  }
}

io.write(total)
