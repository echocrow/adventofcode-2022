import io from 'lib/io.js'

const LOWER_A_CODE = 'a'.charCodeAt(0)
const UPPER_A_CODE = 'A'.charCodeAt(0)
function getPriority(letter: string): number {
  const code = letter.charCodeAt(0)
  const offset = code >= LOWER_A_CODE ? -LOWER_A_CODE : -UPPER_A_CODE + 26
  return code + offset + 1
}

let total = 0
for await (const line of io.readLines()) {
  const half = line.length / 2
  const a = new Set(line.slice(0, half))
  const b = new Set(line.slice(half))
  for (const letter of a) {
    if (b.has(letter)) total += getPriority(letter)
  }
}

io.write(total)
