import characters from "./characters.json" with { type: "json" }

const createCharsString = (key: keyof typeof characters[0]): string => {
  return characters.map(c => c[key]).join("")
}

const primaryChars = createCharsString("primary")
const secondaryChars = createCharsString("secondary")

export const primaryAlphabet = primaryChars
export const fingerprintAlphabet = characters.map(c => c.fingerprint.character).join("")

export const primaryCharsRegex = new RegExp(`^[${ primaryChars }]+$`)
export const nameRegex = new RegExp(`^[${ primaryChars }${ secondaryChars }]+$`)
export const nameStartRegex = new RegExp(`^[${ primaryChars }${ secondaryChars }]+`)

const isFingerprintCharacter = (char: string): boolean => {
  return Array.from(fingerprintAlphabet).includes(char)
}

export const normalizeEmoji = (s: string): string => {
  const codePoint = s.codePointAt(0)
  if (codePoint === undefined) {
    throw new Error ("Invalid emoji")
  }
  const emoji = String.fromCodePoint(codePoint)
  if (!isFingerprintCharacter(emoji)) {
    throw new Error("Invalid fingerprint character")
  }
  return emoji
}

export const normalizeEmojis = (s: string): string => {
  return Array.from(s).filter(c => fingerprintAlphabet.includes(c)).join("")
}

// Not all emojis need a variation selector, but some platforms may render them differently without it.
// To ensure consistent display across platforms, we append the variation selector (U+FE0F) to each emoji.
const addVariationSelector = (s: string): string => {
  const codePoint = s.codePointAt(0)
  if (codePoint === undefined) {
    throw new Error ("Invalid emoji")
  }
  return String.fromCodePoint(codePoint, 0xFE0F) 
}
export const displayEmoji = (s: string): string => {
  const emoji = normalizeEmoji(s)
  const entry = characters.find(c => c.fingerprint.character === emoji)
  if (entry === undefined) {
    throw new Error("Invalid fingerprint character")
  }
  return entry.fingerprint.style === "TEXT" ? addVariationSelector(emoji) : emoji
}

export const displayEmojis = (s: string): string => {
  return Array.from(s).map(displayEmoji).join("")
}
