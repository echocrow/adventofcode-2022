import io from 'lib/io.js'

let seeds = [...(await io.readLine())?.matchAll(/\d+/g)!].map(Number)
let mapped = new Uint8Array(seeds.length)
for await (const [line] of io.readRegExp(/^\d[\d\s]+\d$|^$/m)) {
  if (!line) {
    mapped.fill(0)
    continue
  }
  const [toStart = 0, srcStart = 0, len = 0] = line.split(' ').map(Number)
  const srcEnd = srcStart + len - 1
  const delta = toStart - srcStart
  seeds = seeds.map((n, i) => {
    if (mapped[i] || srcStart > n || n > srcEnd) return n
    mapped[i] = 1
    return n + delta
  })
}

const result = Math.min(...seeds)

io.write(result)
