import readLines from '../../lib/readLines.js'

type Range = [number, number]

function parseRange(r: string): Range {
  return r.split('-').map((n) => parseInt(n, 10)) as Range
}

function isContained(outer: Range, inner: Range): boolean {
  return outer[0] <= inner[0] && outer[1] >= inner[1]
}

let total = 0
for await (const line of readLines(__dirname)) {
  const [r1, r2] = line.split(',').map(parseRange) as [Range, Range]
  if (isContained(r1, r2) || isContained(r2, r1)) total++
}

console.log(total)
