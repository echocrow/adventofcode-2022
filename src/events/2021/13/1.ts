import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'

function foldUp(before: Uint8Matrix): Uint8Matrix {
  const w = before.width
  const len = (before.length - before.width) / 2
  const after = new Uint8Matrix(before.slice(0, len), before.width)
  for (let i = 0; i < after.length; i++) {
    const x = i % w
    const y = (i - x) / w
    const fromY = before.height - y - 1
    after.$[i] += before.$[fromY * w + x] ?? 0
  }
  return after
}

// Parse input.
const dots: [number, number][] = []
const foldInst = 'fold along '
let foldHor = false
for await (const line of io.readLines()) {
  if (line.startsWith(foldInst)) {
    const axis = line[foldInst.length]
    foldHor = axis === 'x'
    break
  } else if (line) {
    const [x = 0, y = 0] = line.split(',').map(Number)
    dots.push([x, y])
  }
}

// Fill sheet.
const width = Math.max(...dots.map((d) => d[0])) + 1
const height = Math.max(...dots.map((d) => d[1])) + 1
const sheet = new Uint8Matrix(width * height, width)
for (const [x, y] of dots) sheet.$[y * width + x] = 1

// You only fold once.
let folded = sheet
if (foldHor) folded = folded.transpose()
folded = foldUp(folded)
if (foldHor) folded = folded.transpose()

const dotsCnt = folded.$.filter(Boolean).length
io.write(dotsCnt)
