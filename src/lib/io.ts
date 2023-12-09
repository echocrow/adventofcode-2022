import {Console} from 'node:console'
import {createReadStream, createWriteStream, writeFileSync} from 'node:fs'
import {createInterface} from 'node:readline'
import {Readable, Writable} from 'node:stream'
import {parseArgs} from 'node:util'

type WriteData = Parameters<typeof writeFileSync>[1]

class IO {
  #_in: AsyncIterableIterator<string> | undefined = undefined
  #_out: Writable | undefined = undefined
  #logged = false

  constructor(
    private input: Readable | undefined = undefined,
    private output: Writable | undefined = undefined,
  ) {}

  #reset() {
    this.#_in = undefined
    this.#_out = undefined
    this.#logged = false
  }
  get #in() {
    return (this.#_in ??= IO.#createIn(this.input))
  }
  get #out() {
    return (this.#_out ??= IO.#createOut(this.output))
  }

  mock(input: string | Readable) {
    this.input = typeof input === 'string' ? Readable.from(input) : input

    let out = ''
    this.output = new Writable({
      write(chunk, encoding, cb) {
        out += String(chunk)
        cb()
      },
    })

    this.#reset()

    return {
      get out() {
        return out
      },
    }
  }

  async readLine(): Promise<string | undefined> {
    const gen = this.#in[Symbol.asyncIterator]()
    return (await gen.next()).value
  }

  async readFile() {
    let file = ''
    for await (const chunk of this.#in) file += chunk + '\n'
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

  write(
    data: WriteData | number | bigint | undefined | null,
    opts: {silent?: boolean} = {},
  ) {
    const str = String(data)
    this.#out.write(str)
    if (!opts.silent) {
      const msg = str.length < 100 ? str : `wrote ${str.length} characters`
      this.log(`[io] Output: ${msg}`)
    }
  }

  #console = new Console(process.stderr)
  log(message: any, ...moreMessage: any[]) {
    this.#logged ||= (this.#console.info(''), true)
    this.#console.info(new Date(), ':', message, ...moreMessage)
  }

  async sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }

  static #createIn(input?: Readable | undefined) {
    if (!input) {
      const inPath = String(IO.#parsedArgs.in ?? '')
      input = inPath ? createReadStream(inPath) : process.stdin
    }
    return createInterface({input})[Symbol.asyncIterator]()
  }
  static #createOut(output?: Writable | undefined) {
    if (!output) {
      const outPath = String(IO.#parsedArgs.out ?? '')
      output = outPath ? createWriteStream(outPath) : process.stdout
    }
    return output
  }

  private static _parseArgs() {
    return parseArgs({
      options: {
        in: {type: 'string', default: ''},
        out: {type: 'string', default: ''},
      },
    }).values
  }
  static #_parsedArgs: ReturnType<(typeof IO)['_parseArgs']> | undefined =
    undefined
  static get #parsedArgs() {
    return (IO.#_parsedArgs ??= IO._parseArgs())
  }
}

export default new IO()
