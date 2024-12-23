import io from '#lib/io.js'
import {count, filter} from '#lib/iterable.js'

let result = 0
const connections: Record<string, Set<string>> = {}
for await (const line of io.readLines()) {
  const [a = '', b = ''] = line.split('-')
  const aCon = (connections[a] ??= new Set()).add(b)
  const bCon = (connections[b] ??= new Set()).add(a)
  const shared = aCon.intersection(bCon)
  if (shared.size)
    result +=
      a.startsWith('t') || b.startsWith('t') ?
        shared.size
      : count(filter(shared, (c) => c.startsWith('t')))
}

io.write(result)
