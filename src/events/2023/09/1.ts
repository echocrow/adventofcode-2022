import io from '#lib/io.js'
import sum from '#lib/sum.js'

let result = 0
for await (const line of io.readLines()) {
  let nums = new Int32Array(line.split(' ').map(Number))
  let diffs = new Int32Array(nums.length)
  let depth = 0
  let allZeros: boolean
  const endNums = new Int32Array(nums.length)
  do {
    const endI = nums.length - depth - 1
    endNums[depth] = nums[endI]! // Keep right-most number for later sum.

    allZeros = true
    for (let i = 0; i < endI; i++) {
      const diff = nums[i + 1]! - nums[i]!
      diffs[i] = diff
      allZeros = allZeros && diff === 0
    }

    ;[nums, diffs] = [diffs, nums]
    depth++
  } while (!allZeros)

  const next = sum(endNums.slice(0, depth))
  result += next
}

io.write(result)
