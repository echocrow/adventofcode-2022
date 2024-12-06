import io from '#lib/io.js'

function xMasRegExps(lineLen: number) {
  const rn = `.{${lineLen + 1 - 3}}`
  return [
    `M(?=.M${rn}.A.${rn}S.S)`,
    `M(?=.S${rn}.A.${rn}M.S)`,
    `S(?=.S${rn}.A.${rn}M.M)`,
    `S(?=.M${rn}.A.${rn}S.M)`,
  ].map((pattern) => new RegExp(pattern, 'gs'))
}

const lineLen = await io.peekLineLen()
const text = await io.readFile()

let result = 0
for (const pattern of xMasRegExps(lineLen)) {
  result += text.match(pattern)?.length ?? 0
}

io.write(result)
