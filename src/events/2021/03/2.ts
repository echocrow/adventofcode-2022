import io from '#lib/io.js'

function findRatingRow(
  rows: boolean[][],
  wantHigh: boolean,
  _i = 0,
): boolean[] {
  if (rows.length === 1) return rows[0] as boolean[]
  const count = rows.reduce(
    (count, row) => count + Number(row[_i] === wantHigh),
    0,
  )
  const needBit =
    count > rows.length / 2 || (count === rows.length / 2 && wantHigh)
  const nextRows = rows.filter((row) => row[_i] === needBit)
  return findRatingRow(nextRows, wantHigh, _i + 1)
}

function parseBinary(bits: boolean[]): number {
  return bits.reduce((bin, bits) => (bin << 1) + Number(bits), 0)
}

const rows: boolean[][] = []
for await (const line of io.readLines()) {
  rows.push([...line].map((d) => d !== '0'))
}

const oRating = parseBinary(findRatingRow(rows, true))
const co2Rating = parseBinary(findRatingRow(rows, false))

io.write(oRating * co2Rating)
