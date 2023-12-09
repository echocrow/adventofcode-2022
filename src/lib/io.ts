import {Console} from 'node:console'
import {createReadStream, createWriteStream, writeFileSync} from 'node:fs'
import {createInterface} from 'node:readline'
import {Readable, Writable} from 'node:stream'

type WriteData = Parameters<typeof writeFileSync>[1]

/**
 * Get argv value by flag name.
 */
function getArgv(name: string) {
  const nameEq = `${name}=`
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i]
    if (arg === name) return process.argv0[i + 1] ?? ''
    if (arg?.startsWith(nameEq)) return arg.slice(nameEq.length)
    if (arg === '--') break
  }
  return ''
}

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
      const inPath = getArgv('--in')
      input = inPath ? createReadStream(inPath) : process.stdin
    }
    return createInterface({input})[Symbol.asyncIterator]()
  }
  static #createOut(output?: Writable | undefined) {
    if (!output) {
      const outPath = getArgv('--out')
      output = outPath ? createWriteStream(outPath) : process.stdout
    }
    return output
  }
}

export default new IO()
