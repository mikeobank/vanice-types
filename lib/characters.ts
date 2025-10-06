import type { Base32 } from "./Base32.ts"
import characters from "./characters.json" with { type: "json" }

const createCharsString = (key: keyof typeof characters[0]): string => {
  return characters.map(c => c[key]).join("")
}

const primaryChars = createCharsString("primary")
const secondaryChars = createCharsString("secondary")
const fingerprintChars = characters.map(c => c.fingerprint.map(entry => entry.character))

export const primaryCharsRegex = new RegExp(`^[${ primaryChars }]+$`)
export const nameRegex = new RegExp(`^[${ primaryChars }${ secondaryChars }]+$`)
export const nameStartRegex = new RegExp(`^[${ primaryChars }${ secondaryChars }]+`)
export const primaryAlphabet = primaryChars

export const getFingerprintIndex = (char: string): Base32 => {
  const index = fingerprintChars.findIndex(chars => chars.includes(char))
  if (index === -1) {
    throw new Error("Invalid fingerprint character")
  }
  return index
}

export const getFingerprintChar = (index: Base32): string => {
  return fingerprintChars[index][0]
}
