import IO from 'lib/io.js'

const io = new IO()

let rows = 0
const ones: number[] = []
for await (const line of io.readLines()) {
  for (const [i, d] of line.split('').entries()) {
    if (d === '0') ones[i] = (ones[i] ?? 0) + 1
  }
  rows++
}

const highs = ones.map((count) => count > rows / 2)

const gamma = highs.reduce((gamma, highs) => (gamma << 1) + Number(highs), 0)
const epsilon = (2 ** highs.length - 1) & ~gamma

io.write(gamma * epsilon)
