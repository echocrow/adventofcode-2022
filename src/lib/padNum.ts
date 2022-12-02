export default function padNum(num: number, size: number): string {
  let str = num.toString()
  return '0'.repeat(size - str.length) + str
}
