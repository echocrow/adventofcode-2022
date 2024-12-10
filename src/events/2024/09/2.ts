import io from '#lib/io.js'
import {sumIntSeries} from '#lib/math.js'

class File {
  constructor(
    public readonly id: number,
    public readonly len: number,
    public start: number,
    public prev: File | null = null,
    public next: File | null = null,
  ) {}
}

class Space {
  constructor(
    public start: number,
    public len: number,
    public prev: File,
  ) {}
}

// Parse disk map.
const files: File[] = []
const spaces: Space[] = []
{
  let prevFile: File | null = null
  let blockId = 0
  let i = 0
  for (const strLen of (await io.readLine())!) {
    let len = +strLen

    // Handle file.
    if (i % 2 === 0) {
      const file: File = new File(i / 2, len, blockId, prevFile)
      files.push(file)
      if (prevFile) prevFile.next = file
      prevFile = file
    }
    // Handle free space.
    else {
      const space = new Space(blockId, len, prevFile!)
      spaces.push(space)
    }

    i++
    blockId += len
  }
}

// Re-locate files.
for (let f = files.length - 1; f >= 0; f--) {
  const file = files[f]!
  for (let s = 0; s < spaces.length; s++) {
    const space = spaces[s]!

    // Handle exhausted search.
    if (space.start > file.start) {
      spaces.splice(s)
      break
    }

    // Handle sufficient free space.
    if (space.len >= file.len) {
      if (file.prev) file.prev.next = file.next
      if (file.next) file.next.prev = file.prev

      const nextFile = space.prev.next
      space.prev.next = file
      file.prev = space.prev
      file.next = nextFile
      if (nextFile) nextFile.prev = file

      file.start = space.start

      const newSpaceLen = space.len - file.len
      // Handle fragmented space.
      if (newSpaceLen) {
        space.len = newSpaceLen
        space.start += file.len
        space.prev = file
      }
      // Handle exhausted space.
      else {
        spaces.splice(s, 1)
      }
      break
    }
  }
}

let result = 0
{
  let file = files[0] ?? null
  while (file) {
    const startId = file.start
    const endId = startId + file.len - 1
    result += file.id * sumIntSeries(startId, endId)
    file = file.next
  }
}

io.write(result)
