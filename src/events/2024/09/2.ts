import io from '#lib/io.js'
import {entries, sum, reversed} from '#lib/iterable.js'
import {sumIntSeries} from '#lib/math.js'

class File {
  constructor(
    public readonly id: number,
    public start: number,
    public readonly len: number,
  ) {}
}

class Space {
  constructor(
    public prev: File,
    public start: number,
    public len: number,
  ) {}
}

// Parse disk map.
const files: File[] = []
const spaces: Space[] = []
{
  let blockId = 0
  for (const [i, lenStr] of entries((await io.readLine())!)) {
    const len = +lenStr
    // Handle file.
    if (i % 2 === 0) files.push(new File(files.length, blockId, len))
    // Handle free space.
    else spaces.push(new Space(files.at(-1)!, blockId, len))
    blockId += len
  }
}

// Re-locate files.
for (const file of reversed(files)) {
  for (const [s, space] of spaces.entries()) {
    // Handle exhausted search.
    if (space.start > file.start) {
      spaces.splice(s)
      break
    }

    // Handle sufficient free space.
    if (space.len >= file.len) {
      file.start = space.start

      const newSpaceLen = space.len - file.len
      // Handle fragmented space.
      if (newSpaceLen) {
        space.prev = file
        space.start += file.len
        space.len = newSpaceLen
      }
      // Handle exhausted space.
      else {
        spaces.splice(s, 1)
      }
      break
    }
  }
}

const result = sum(
  files.map(
    (file) => file.id * sumIntSeries(file.start, file.start + file.len - 1),
  ),
)
io.write(result)
