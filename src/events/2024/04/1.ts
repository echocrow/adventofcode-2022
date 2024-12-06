import io from '#lib/io.js'

function xmasRegExps(lineLen: number) {
  const down = `.{${lineLen}}`
  const downRight = `.{${lineLen + 1}}`
  const downLeft = `.{${lineLen - 1}}`
  return ['', down, downRight, downLeft].flatMap((step) => [
    new RegExp(`X(?=${step}M${step}A${step}S)`, 'gs'),
    new RegExp(`S(?=${step}A${step}M${step}X)`, 'gs'),
  ])
}

const lineLen = await io.peekLineLen()
const text = await io.readFile()

let result = 0
for (const pattern of xmasRegExps(lineLen)) {
  result += text.match(pattern)?.length ?? 0
}

io.write(result)
