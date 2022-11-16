export const removeExtraWhiteSpaces = (input: string) => {
  return input.replace(/\s+/g, ' ').trim()
}
