export function joinRegExp(regexps: RegExp[], glue = '\n'): RegExp {
  return new RegExp(regexps.map((r) => r.source).join(glue))
}
