import readLines from '../../lib/readLines.js'

type Range = [number, number]

function parseRange(r: string): Range {
  return r.split('-').map((n) => parseInt(n, 10)) as Range
}

function areDistinct(a: Range, b: Range): boolean {
  return a[1] < b[0] || a[0] > b[1]
}

let total = 0
for await (const line of readLines(__dirname)) {
  const [r1, r2] = line.split(',').map(parseRange) as [Range, Range]
  if (!areDistinct(r1, r2)) total++
}

console.log(total)
