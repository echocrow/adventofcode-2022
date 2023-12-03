import io from 'lib/io.js'
import sliceByLen from 'lib/sliceByLen.js'

// Pad input.
const srcInput = await io.readFile()
const srcRowLen = srcInput.indexOf('\n') + 1
const input =
  [
    '.'.repeat(srcRowLen + 1),
    `.${srcInput.replaceAll('\n', '.\n.')}.`,
    '.'.repeat(srcRowLen + 1),
  ].join('\n') + '\n'
const rowLen = srcRowLen + 2

const numRe = /\d+/g
const symbolRe = /[^.\d]/

let result = 0
let match: RegExpExecArray | null
while ((match = numRe.exec(input))) {
  const num = match[0]
  const matchLen = num.length
  const pos = match.index
  const border =
    sliceByLen(input, pos - rowLen - 1, matchLen + 2) +
    input[pos - 1] +
    input[pos + matchLen] +
    sliceByLen(input, pos + rowLen - 1, matchLen + 2)
  if (symbolRe.test(border)) result += Number(num)
}

io.write(result)
