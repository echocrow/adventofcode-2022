import {sortNums} from '#lib/array.js'
import io from '#lib/io.js'

function calcMedian(nums: number[]): number {
  if (!nums.length) return NaN

  sortNums(nums)

  const len = nums.length
  const center = len / 2
  const left = Math.floor(center)
  const right = Math.ceil(center)
  return left === right ? nums[center]! : (nums[left]! + nums[right]!) / 2
}

let result = 0
for await (const line of io.readLines()) {
  const nums = line.split(',').map(Number)
  const med = calcMedian(nums)
  for (const num of nums) result += Math.abs(med - num)
}

io.write(result)
