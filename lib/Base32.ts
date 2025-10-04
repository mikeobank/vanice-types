import isNumber from "./utils/isNumber.ts"
import isString from "./utils/isString.ts"
import getUTF8StringLength from "./utils/getUTF8StringLength.ts"

type Base32 = number
type Base32Array = Base32[]
type Base32Alphabet = string

export const isBase32 = (value: unknown): value is Base32 => {
  return isNumber(value) && Number.isInteger(value) && value >= 0 && value < 32
}

export const isBase32Array = (value: unknown): value is Base32Array => {
  return Array.isArray(value) && value.every(isBase32)
}

export const isBase32Alphabet = (value: unknown): value is Base32Alphabet => {
  return isString(value) && getUTF8StringLength(value) === 32
}

/**
 * Converts a Uint8Array to an array of 5-bit values (0-31)
 * Each byte (8 bits) is split into base32 values (5 bits each)
 */
export const uint8ArrayToBase32Array = (input: Uint8Array): Base32Array => {
  const result: Base32Array = []
  let bits = 0
  let value = 0

  for (let i = 0; i < input.length; i++) {
    // Add current byte to our bit buffer
    value = (value << 8) | input[i]
    bits += 8

    // Extract 5-bit chunks while we have enough bits
    while (bits >= 5) {
      result.push((value >>> (bits - 5)) & 0x1F)
      bits -= 5
    }
  }

  // Handle remaining bits (if any)
  if (bits > 0) {
    result.push((value << (5 - bits)) & 0x1F)
  }

  return result
}


/**
 * Converts an array of 5-bit values (0-31) back to a Uint8Array
 */
export const base32ToUint8Array = (input: Base32Array): Uint8Array => {
  const result: number[] = []
  let bits = 0
  let value = 0

  for (let i = 0; i < input.length; i++) {
    // Add current 5-bit value to our bit buffer
    value = (value << 5) | (input[i] & 0x1F)
    bits += 5

    // Extract 8-bit chunks while we have enough bits
    while (bits >= 8) {
      result.push((value >>> (bits - 8)) & 0xFF)
      bits -= 8
    }
  }

  // Note: remaining bits (if any) are discarded as padding
  
  return new Uint8Array(result)
}

export const encode = (arr: Base32Array, alphabet: Base32Alphabet): string => {
  if (!isBase32Array(arr)) {
    throw new Error("Input is not a valid Base32 array")
  }
  if (!isBase32Alphabet(alphabet)) {
    throw new Error("Alphabet must be a string of exactly 32 characters")
  }

  const chars = Array.from(alphabet)
  
  return arr.map(v => chars[v]).join("")
}

export const decode = (str: string, alphabet: Base32Alphabet): Base32Array => {
  if (!isBase32Alphabet(alphabet)) {
    throw new Error("Alphabet must be a string of exactly 32 characters")
  }

  const chars = Array.from(alphabet)
  return Array.from(str).map(char => {
    const index = chars.indexOf(char)
    if (index === -1) {
      throw new Error(`Character not in alphabet: ${char}`)
    }
    return index
  })
}
