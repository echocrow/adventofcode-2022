import io from '#lib/io.js'

function canMatch(target: number, nums: number[], accum = 0, i = 0): boolean {
  if (i >= nums.length) return accum === target
  if (accum > target) return false
  const num = nums[i++]!
  return (
    canMatch(target, nums, accum + num, i) ||
    canMatch(target, nums, accum * num, i)
  )
}

let result = 0
for await (const line of io.readLines()) {
  const nums = [...line.matchAll(/\d+/g).map((m) => +m[0])]
  const target = nums.shift()!
  if (canMatch(target, nums)) result += target
}

io.write(result)
