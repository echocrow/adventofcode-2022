import {createReadStream, writeFileSync, openSync} from 'node:fs'
import path from 'node:path'
import {createInterface, type Interface} from 'node:readline'

type WriteData = Parameters<typeof writeFileSync>[1]

export default class IO {
  #inPath: string
  #outPath: string

  #inReader: Interface | undefined
  #outFileDesc: number | undefined

  constructor(dir = './io', input = 'in.txt', output = 'out.txt') {
    this.#inPath = path.join(dir, input)
    this.#outPath = path.join(dir, output)
  }

  get #reader() {
    return (this.#inReader ??= createInterface({
      input: createReadStream(this.#inPath),
    }))
  }

  async readLine(): Promise<string> {
    const gen = this.#reader[Symbol.asyncIterator]()
    return (await gen.next()).value ?? ''
  }

  async *readLines(rows = 1): AsyncGenerator<string, void, undefined> {
    let r = 0
    let buff = ''
    for await (const row of this.#reader) {
      if (buff) buff += '\n'
      buff += row
      r++
      if (r === rows) {
        yield buff
        r = 0
        buff = ''
      }
    }
    if (r) yield buff
  }

  async *readRegExp(
    pattern: RegExp,
  ): AsyncGenerator<RegExpExecArray, void, undefined> {
    let buff = ''
    for await (const row of this.#reader) {
      buff += (buff ? '\n' : '') + row
      const res = pattern.exec(buff)
      if (res) {
        yield res
        buff = ''
      }
    }
  }

  write(data: WriteData | number) {
    this.#outFileDesc ??= openSync(this.#outPath, 'w+')
    if (typeof data === 'number') data = String(data)
    writeFileSync(this.#outFileDesc, data)
  }
}
