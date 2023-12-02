import io from 'lib/io.js'

const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}
const SCORES: Record<string, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

function validate(str: string): string {
  const closers: string[] = []
  for (const c of str) {
    const closer = closers[closers.length - 1] ?? ''
    if (c in PAIRS) {
      closers.push(PAIRS[c]!)
    } else if (c === closer) {
      closers.pop()
    } else {
      return c
    }
  }
  return ''
}

let result = 0
for await (const line of io.readLines()) {
  const invalid = validate(line)
  result += SCORES[invalid] ?? 0
}

io.write(result)
