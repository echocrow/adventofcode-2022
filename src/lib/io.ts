import {createReadStream, writeFileSync, openSync} from 'node:fs'
import path from 'node:path'
import {createInterface} from 'node:readline'

type WriteData = Parameters<typeof writeFileSync>[1]

export class IO {
  #inPath: string
  #outPath: string

  #inReader: AsyncIterableIterator<string> | undefined
  #outFileDesc: number | undefined

  constructor(dir = './io', input = 'in.txt', output = 'out.txt') {
    this.#inPath = path.join(dir, input)
    this.#outPath = path.join(dir, output)
  }

  get #reader() {
    return (this.#inReader ??= createInterface({
      input: createReadStream(this.#inPath),
    })[Symbol.asyncIterator]())
  }

  async readLine(): Promise<string | undefined> {
    const gen = this.#reader[Symbol.asyncIterator]()
    return (await gen.next()).value
  }

  async readFile() {
    let file = ''
    for await (const chunk of this.#reader) {
      file += chunk + '\n'
    }
    return file.slice(0, -1)
  }

  async *readLines(rows = 1): AsyncGenerator<string, void, undefined> {
    let r = 0
    let buff = ''
    let row: string | undefined
    while ((row = await this.readLine()) !== undefined) {
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
    opts: {suffix?: string} = {},
  ): AsyncGenerator<RegExpExecArray, void, undefined> {
    let buff = ''
    let row: string | undefined
    let {suffix} = opts
    function consumeSuffix(s = suffix) {
      return (suffix = undefined), s
    }
    while ((row = (await this.readLine()) ?? consumeSuffix()) !== undefined) {
      buff += (buff ? '\n' : '') + row
      const res = pattern.exec(buff)
      if (res) {
        yield res
        buff = ''
      }
    }
  }

  write(data: WriteData | number | bigint | undefined | null) {
    this.#outFileDesc ??= openSync(this.#outPath, 'w+')
    if (typeof data === 'number') data = String(data)
    writeFileSync(this.#outFileDesc, String(data))
  }

  #logged = false
  log(message: any, ...moreMessage: any[]) {
    this.#logged ||= (console.info(''), true)
    console.info(new Date(), ':', message, ...moreMessage)
  }

  async sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }
}

const io = new IO()
export default io
