import type {Sliceable} from './types.js'

export default function sliceByLen<T>(
  str: Sliceable<T>,
  start: number,
  len: number,
): T {
  return str.slice(start, start + len)
}
