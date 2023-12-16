import io from '#lib/io.js'
import {entries} from '#lib/iterable.js'
import {range} from '#lib/iterable.js'

const boxes = Array.from(range(0, 256), () => new Map<string, number>())
for await (const [_, label = '', op = '', num = ''] of io.readRegExp(
  /(\w+)([=-])(\d+)?/,
)) {
  let hash = 0
  for (let i = 0; i < label.length; i++)
    hash = ((hash + label.charCodeAt(i)) * 17) % 256

  if (op === '-') boxes[hash]!.delete(label)
  else boxes[hash]!.set(label, Number(num))
}

let result = 0
for (const [boxId, box] of boxes.entries())
  for (const [slot, focal] of entries(box.values()))
    result += (boxId + 1) * focal * (slot + 1)

io.write(result)
