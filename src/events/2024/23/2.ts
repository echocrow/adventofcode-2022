import {findMaxCliques} from '#lib/graph.js'
import io from '#lib/io.js'
import {reduce} from '#lib/iterable.js'

const connections: Record<string, Set<string>> = {}
for await (const line of io.readLines()) {
  const [a = '', b = ''] = line.split('-')
  ;(connections[a] ??= new Set()).add(b)
  ;(connections[b] ??= new Set()).add(a)
}

const maxClique = reduce(
  findMaxCliques(connections),
  (acc, clique) => (clique.size > acc.size ? clique : acc),
  new Set<string>(),
)

const result = [...maxClique].sort().join(',')
io.write(result)
