import {reduce} from './iterable.js'

/**
 * Find the maximum cliques in a graph using the Bron-Kerbosch algorithm.
 *
 * @see https://youtu.be/j_uQChgo72I
 *
 * @param graph
 *   A dict of nodes (keys), and a set of their respective neighbors (values).
 */
export function* findMaxCliques(
  graph: Record<string, Set<string>>,
  res = new Set<string>(),
  next = new Set(Object.keys(graph)),
  excludes = new Set<string>(),
): Iterable<Set<string>> {
  if (!next.size) {
    if (!excludes.size) yield res
    return
  }

  // Find the largest set of neighbors for the given candidates.
  const pivotNeighbors = reduce(
    next,
    (acc, n) => (graph[n]!.size > acc.size ? graph[n]! : acc),
    new Set<string>(),
  )

  for (const v of next.difference(pivotNeighbors)) {
    const neighbors = graph[v]!
    yield* findMaxCliques(
      graph,
      new Set(res).add(v),
      next.intersection(neighbors),
      excludes.intersection(neighbors),
    )
    next.delete(v)
    excludes.add(v)
  }
}
