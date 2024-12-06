import {Console} from 'node:console'
import {createReadStream, createWriteStream, writeFileSync} from 'node:fs'
import {createInterface} from 'node:readline'
import {Readable, Writable} from 'node:stream'
import {parseArgs} from 'node:util'

type WriteData = Parameters<typeof writeFileSync>[1]

class IO {
  #_in: AsyncIterableIterator<string> | undefined = undefined
  #_out: Writable | undefined = undefined
  logSilent = false
  #logged = false
  #buffer: string | undefined = undefined
  #appendix: string | undefined = undefined
  #perfStart = 0

  constructor(
    private input: Readable | undefined = undefined,
    private output: Writable | undefined = undefined,
  ) {
    this.#reset()
  }

  #reset() {
    this.#_in = undefined
    this.#_out = undefined
    this.#logged = false
    this.#buffer = undefined
    this.#appendix = undefined
    this.#perfStart = performance.now()
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
    this.logSilent = true

    return {
      get out() {
        return out
      },
    }
  }

  async #readNextLine(): Promise<string | undefined> {
    return (await this.#in.next()).value
  }
  async peekLine(): Promise<string | undefined> {
    return (this.#buffer ??= await this.#readNextLine())
  }
  async peekLineLen(): Promise<number> {
    return (await this.peekLine())?.length ?? 0
  }
  async readLineIfMatch(
    regExp: RegExp,
  ): Promise<RegExpMatchArray | null | undefined> {
    const line = await this.peekLine()
    const match = line !== undefined ? line.match(regExp) : undefined
    if (match) this.#buffer = undefined
    return match
  }
  async readCfgLine(name: string): Promise<string | undefined> {
    const re = new RegExp(`^${name}=(.*)$`)
    return (await this.readLineIfMatch(re))?.[1]
  }

  #readBuffer(): string | undefined {
    const buffer = this.#buffer
    this.#buffer = undefined
    return buffer
  }
  #readAppendix(): string | undefined {
    const appendix = this.#appendix
    this.#appendix = undefined
    return appendix
  }
  async readLine(): Promise<string | undefined> {
    return (
      this.#readBuffer() ?? (await this.#readNextLine()) ?? this.#readAppendix()
    )
  }

  async readFile() {
    let file = this.#readBuffer()
    if (file) file += '\n'
    file ??= ''
    for await (const chunk of this.#in) file += chunk + '\n'
    return file.slice(0, -1)
  }

  async *readLines(
    opts: {
      rows?: number
      flush?: boolean
    } = {},
  ): AsyncGenerator<string, void, undefined> {
    let r = 0
    let buff = ''
    let row: string | undefined
    const {rows = 1} = opts
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
    if (r || opts.flush) yield buff
  }

  async *readRegExp(
    regExp: RegExp,
    opts: {appendix?: string} = {},
  ): AsyncGenerator<RegExpExecArray, void, undefined> {
    this.#appendix = opts.appendix

    let buff = ''
    let line: string | undefined
    while ((line = await this.readLine()) !== undefined) {
      buff += line
      let res: RegExpExecArray | null
      let matched = false
      while ((res = regExp.exec(buff))) {
        matched = true
        buff = buff.slice(res.index + res[0].length || 1)
        yield res
        // Manually break when buffer was fully consumed. This prevents
        // infinite loops when matching empty lines.
        if (!buff) break
      }
      // Skip newline when we matched _and_ fully consumed the buffer for a
      // cleaner buffer next round (no leading newline after flushed buffer).
      if (!matched || buff) buff += '\n'
    }
    if (buff) this.#buffer = (this.#buffer ?? '') + buff
  }

  write(
    data: WriteData | number | bigint | undefined | null,
    opts: {silent?: boolean} = {},
  ) {
    const str = String(data)
    this.#out.write(str)
    if (!opts.silent) {
      this.#logPerf(this.#perfStart)
      const msg = str.length < 100 ? str : `wrote ${str.length} characters`
      this.log(`[io] 📄 Output: ${msg}`)
    }
  }

  #console = new Console(process.stderr)
  log(message: any, ...moreMessage: any[]) {
    if (this.logSilent) return
    this.#logged ||= (this.#console.info(''), true)
    if (
      typeof message === 'string' &&
      message[0] !== '\n' &&
      message.includes('\n')
    )
      message = '\n' + message
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

  perf(): () => void {
    const start = performance.now()
    return () => this.#logPerf(start)
  }
  #logPerf(start: number) {
    const end = performance.now()
    this.log(`[io] ⌛️ Time: ${Math.round(end - start)}ms`)
  }
}

export default new IO()
