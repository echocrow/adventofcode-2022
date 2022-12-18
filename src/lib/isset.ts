export default function isset<T>(thing: T): thing is NonNullable<T> {
  return (
    thing !== undefined &&
    thing !== null &&
    (typeof thing !== 'number' || !isNaN(thing))
  )
}
