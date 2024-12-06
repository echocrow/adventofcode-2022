export function repeat(str: string, count: number, glue: string) {
  return (str + glue).repeat(count).slice(0, -glue.length)
}

export function padNum(num: number, size: number): string {
  let str = num.toString()
  return '0'.repeat(size - str.length) + str
}
