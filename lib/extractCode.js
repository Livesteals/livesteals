const CODE_REGEX = /\b[A-Z0-9]{3,8}-[A-Z0-9]{3,8}-[A-Z0-9]{3,8}\b/gi

export function pickAllCodes(text) {
  const matches = text.match(CODE_REGEX) || []
  return [...new Set(matches.filter(m => /[A-Z]/i.test(m)).map(m => m.toUpperCase()))]
}
