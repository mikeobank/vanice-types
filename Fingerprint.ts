import { type Base32, type Base32Array, isBase32Array } from "./lib/Base32.ts"
import { getFingerprintChar, getFingerprintIndex } from "./lib/characters.ts"
import getUTF8StringLength from "./lib/utils/getUTF8StringLength.ts"
import splitEmojiString from "./lib/utils/splitEmojiString.ts"

export type Fingerprint = Base32Array
export type FingerprintDisplay = string

export const parseFingerprint = (str: string): Fingerprint => {
  const characters = splitEmojiString(str)
  return characters.map(char => {
    return getFingerprintIndex(char)
  })
}

export const isFingerprint = (value: unknown): value is Fingerprint => {
  return isBase32Array(value) && value.length > 0
}

export const getFingerprintLength = (fingerprint: Fingerprint): number => {
  if (!isFingerprint(fingerprint)) {
    throw new Error("Invalid Fingerprint")
  }
  return fingerprint.length
}

export const compareFingerprints = (a: Fingerprint, b: Fingerprint): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export const fingerprintStartsWithFingerprint = (fingerprint: Fingerprint, partialFingerprint: Fingerprint): boolean => {
  if (partialFingerprint.length > fingerprint.length) return false
  for (let i = 0; i < partialFingerprint.length; i++) {
    if (fingerprint[i] !== partialFingerprint[i]) return false
  }
  return true
}

export const sliceFingerprint = (fingerprint: Fingerprint, length?: number): Fingerprint => {
  if (!isFingerprint(fingerprint)) {
    throw new Error("Invalid Fingerprint")
  }
  if (length === undefined) {
    return fingerprint
  }
  return fingerprint.slice(0, length)
}

export const isFingerprintDisplay = (str: string): str is FingerprintDisplay => {
  try {
    parseFingerprint(str)
    return true
  } catch {
    return false
  }
}

export const getFingerprintDisplayLength = (fingerprintDisplay: FingerprintDisplay): number => {
  if (!isFingerprintDisplay(fingerprintDisplay)) {
    throw new Error("Invalid FingerprintDisplay")
  }
  return getUTF8StringLength(fingerprintDisplay)
}

export const displayFingerprint = (fingerprint: Fingerprint): FingerprintDisplay => {
  return fingerprint.map((index: Base32) => getFingerprintChar(index)).join("")
}

export const normalizeFingerprintDisplay = (fingerprintDisplay: FingerprintDisplay): FingerprintDisplay => {
  try {
    return displayFingerprint(parseFingerprint(fingerprintDisplay))
  } catch {
    throw new Error("Invalid FingerprintDisplay")
  }
}

export const isNormalizedFingerprintDisplay = (fingerprintDisplay: FingerprintDisplay): boolean => {
  return fingerprintDisplay === normalizeFingerprintDisplay(fingerprintDisplay)
}
