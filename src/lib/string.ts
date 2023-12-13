export function repeat(str: string, count: number, glue: string) {
  return (str + glue).repeat(count).slice(0, -glue.length)
}
