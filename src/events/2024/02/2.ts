import io from '#lib/io.js'

const MAX_DELTA = 3

function checkReport(report: number[]): number | null {
  let growth = 0
  for (let i = 1; i < report.length; i++) {
    const prev = report[i - 1]!
    const curr = report[i]!
    const delta = curr - prev
    const sign = Math.sign(delta)
    growth ||= sign
    if (!sign || sign !== growth || Math.abs(delta) > MAX_DELTA) return i
  }
  return null
}

let result = 0
for await (const line of io.readLines()) {
  const levels = line.split(' ').map(Number)
  const badIdx = checkReport(levels)
  const isSafe =
    badIdx === null ||
    checkReport(levels.toSpliced(badIdx, 1)) === null ||
    checkReport(levels.toSpliced(badIdx - 1, 1)) === null ||
    (badIdx >= 2 && checkReport(levels.toSpliced(badIdx - 2, 1)) === null)
  if (isSafe) result++
}

io.write(result)
