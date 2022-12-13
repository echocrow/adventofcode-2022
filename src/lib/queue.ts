export function enqueue<V>(
  queue: V[],
  findNext: (item: V) => boolean,
  item: V,
): V[] {
  const q = queue.findIndex(findNext)
  if (q >= 0) queue.splice(q, 0, item)
  else queue.push(item)
  return queue
}
