import io from '#lib/io.js'

let locks: number[] = []
let keys: number[] = []
{
  let isKey: boolean | null = null
  let acc = 0
  let buff = 0
  for await (const line of io.readLines({flush: true})) {
    if (!line) {
      ;(isKey ? keys : locks).push(acc)
      isKey = null
      acc = buff = 0
      continue
    }

    acc = (acc << line.length) | buff

    buff = 0
    for (const c of line) buff = (buff << 1) | +(c === '#')
    isKey ??= !buff
  }
}

let result = 0
for (const key of keys) for (const lock of locks) if (!(lock & key)) result++

io.write(result)
