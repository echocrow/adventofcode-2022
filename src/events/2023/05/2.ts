import io from 'lib/io.js'

type Range = [number, number]

function fmtRange(start: number, end: number): Range | null {
  return end >= start ? [start, end] : null
}

let seeds = [...(await io.readLine())?.matchAll(/\d+/g)!].map(Number).reduce(
  (acc, n, i) => {
    if (i % 2) acc.pairs.push([acc.prev, acc.prev + n - 1])
    else acc.prev = n
    return acc
  },
  {pairs: [] as Range[], prev: 0},
).pairs

await io.readLine()
for await (const [line] of io.readRegExp(/[\s\d\n]+?\n\n/, {suffix: '\n'})) {
  const maps = line
    .trim()
    .split('\n')
    .map((row) => row.split(' ').map(Number) as [number, number, number])

  let newSeeds: typeof seeds = []
  for (const seed of seeds) {
    let unmappedSeeds = [seed]
    const mappedSeeds: typeof seeds = []
    for (const [outStart, inStart, mapLen] of maps) {
      const remainingSeeds: typeof unmappedSeeds = []
      for (const seed of unmappedSeeds) {
        const [sStart, sEnd] = seed

        const inEnd = inStart + mapLen - 1

        const before = fmtRange(sStart, Math.min(sEnd, inStart - 1))
        const after = fmtRange(Math.max(sStart, inEnd + 1), sEnd)
        const inner = fmtRange(Math.max(sStart, inStart), Math.min(sEnd, inEnd))

        if (before) remainingSeeds.push(before)
        if (after) remainingSeeds.push(after)

        const delta = outStart - inStart
        if (inner) mappedSeeds.push([inner[0] + delta, inner[1] + delta])
      }
      unmappedSeeds = remainingSeeds
    }
    newSeeds = newSeeds.concat(mappedSeeds, unmappedSeeds)
  }
  seeds = newSeeds
}

const result = Math.min(...seeds.map((s) => s[0]))
io.write(result)
