import io from '#lib/io.js'
import {sumIntSeries} from '#lib/math.js'

const diskMap = ((await io.readLine()) ?? '')?.split('').map((n) => +n)

const result = (() => {
  let result = 0
  let blockId = 0
  return {
    get result() {
      return result
    },
    add(fileId: number, len: number) {
      const startId = blockId
      const endId = startId + len - 1
      result += fileId * sumIntSeries(startId, endId)
      blockId = endId + 1
    },
  }
})()

for (let i = 0; i < diskMap.length; i++) {
  let len = diskMap[i]!

  // Handle file.
  if (i % 2 === 0) {
    const fileId = i / 2
    result.add(fileId, len)
    continue
  }

  // Handle free space.
  while (len > 0) {
    const fileIdx = diskMap.length - 1
    const fileBlocks = diskMap[fileIdx]!
    const moveLen = Math.min(len, fileBlocks)

    const fileId = (diskMap.length - 1) / 2
    result.add(fileId, moveLen)

    // Handle fragmented last file.
    if (moveLen < fileBlocks) diskMap[fileIdx]! -= moveLen
    // Handle exhausted last file.
    else diskMap.splice(fileIdx - 1, 2)

    len -= moveLen
  }
}

io.write(result.result)
