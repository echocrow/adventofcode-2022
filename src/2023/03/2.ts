import io from 'lib/io.js'
import product from 'lib/product.js'
import sliceByLen from 'lib/sliceByLen.js'
import sum from 'lib/sum.js'

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
const gearRe = /\*/g

// Collect gears.
const allGears = new Map<number, number[]>()
let match: RegExpExecArray | null
while ((match = numRe.exec(input))) {
  const num = match[0]
  const matchLen = num.length
  const pos = match.index
  const border = [
    sliceByLen(input, pos - rowLen - 1, matchLen + 2),
    input[pos - 1]! + '.'.repeat(matchLen) + input[pos + matchLen]!,
    sliceByLen(input, pos + rowLen - 1, matchLen + 2),
  ].join(' '.repeat(rowLen - matchLen - 2))

  // Find surrounding gears.
  for (const gear of border.matchAll(gearRe)) {
    const gearPos = pos + gear.index!
    let gearNums = allGears.get(gearPos)
    if (!gearNums) allGears.set(gearPos, (gearNums = []))
    gearNums.push(Number(num))
  }
}

const result = sum(
  [...allGears.values()]
    .filter((nums) => nums.length === 2)
    .map((nums) => product(nums)),
)

io.write(result)
