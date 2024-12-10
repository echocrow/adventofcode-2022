import {sortNums} from '#lib/array.js'
import io from '#lib/io.js'

const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}
const SCORES: Record<string, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

function validate(str: string): string[] {
  const closers: string[] = []
  for (const c of str) {
    const closer = closers.at(-1) ?? ''
    if (c in PAIRS) {
      closers.push(PAIRS[c]!)
    } else if (c === closer) {
      closers.pop()
    } else {
      return []
    }
  }
  return closers.reverse()
}

const scores: number[] = []
for await (const line of io.readLines()) {
  const closers = validate(line)
  const score = closers.reduce((s, c) => s * 5 + (SCORES[c] ?? 0), 0)
  if (score) scores.push(score)
}

sortNums(scores)
const result = scores[(scores.length - 1) / 2] ?? 0
io.write(result)
