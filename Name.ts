import { displayEmojis, fingerprintAlphabet, nameRegex, nameStartRegex, normalizeEmojis } from "./lib/characters.ts"
import { nameToPrimaryChars } from "./lib/codec.ts"
import isString from "./lib/utils/isString.ts"
import getUTF8StringLength from "./lib/utils/getUTF8StringLength.ts"
import { type PrimaryKey, type PrimaryChars, isPrimaryKey } from "./PrimaryKey.ts"
import { primaryKeyToPublicKey, publicKeyToFingerprint } from "./PublicKey.ts";

export type Name = string
export type PrimaryName = PrimaryChars
export type Fingerprint = string
export type FingerprintDisplay = string
export type FingerprintedName = `${ Name }${ FingerprintDisplay }`
type AnalyzedName = {
  name: Name
  fingerprintedName: FingerprintedName, 
  nameLength: number
  fingerprint: Fingerprint
  fingerprintLength: number
  totalLength: number
}

const MIN_NAME_LENGTH = 4
const MIN_FINGERPRINTED_NAME_LENGTH = 10
const MIN_FINGERPRINT_LENGTH = 3

export const isName = (value: unknown): value is Name => {
  return isString(value) && value.length > 0 && nameRegex.test(value)
}

export const normalizeFingerprint = (fingerprint: FingerprintDisplay): Fingerprint => {
  return normalizeEmojis(fingerprint)
}

export const displayFingerprint = (fingerprint: Fingerprint): FingerprintDisplay => {
  return displayEmojis(fingerprint)
}

export const isFingerprint = (value: unknown): value is Fingerprint => {
  if (!isString(value) || value.length === 0) return false
  const allowedChars = new Set(Array.from(fingerprintAlphabet))
  return Array.from(value).every(char => allowedChars.has(char))
}

export const isFingerprintDisplay = (value: unknown): value is FingerprintDisplay => {
  return isString(value) && isFingerprint(normalizeFingerprint(value)) && value === displayFingerprint(value)
} 

export const getFingerprintLength = (fingerprint: Fingerprint): number => {
  if (!isFingerprint(fingerprint)) {
    throw new Error("Invalid Fingerprint")
  }
  return getUTF8StringLength(fingerprint)
}

export const splitFingerprintedName = (fingerprintedName: FingerprintedName): [Name, Fingerprint] => {
  const match = fingerprintedName.match(nameStartRegex)
  if (match === null) {
    throw new Error("Invalid fingerprinted name")
  }
  const name = match[0]
  const fingerprint = fingerprintedName.slice(name.length)
  if (!isName(name) || !isFingerprint(fingerprint)) {
    throw new Error("Invalid fingerprinted name")
  }
  return [name, fingerprint]
}

export const isFingerprintedName = (value: unknown): value is FingerprintedName => {
  if (isString(value)) {
    try {
      splitFingerprintedName(value)
      return true
    } catch { /**/ }
  }
  return false
}

export const isAcceptedName = (n: Name | FingerprintedName, l = MIN_NAME_LENGTH): boolean => {
  const name = isFingerprintedName(n) ? splitFingerprintedName(n)[0] : n
  return name.length >= l
}

export const isNameOrFingerprintedName = (value: unknown): value is Name | FingerprintedName => {
  return isName(value) || isFingerprintedName(value)
}

export const analyzeFingerprintedName = (fingerprintedName: FingerprintedName): AnalyzedName => {
  const [name, fingerprint] = splitFingerprintedName(fingerprintedName)
  const nameLength = name.length
  const fingerprintLength = getFingerprintLength(fingerprint)
  const totalLength = nameLength + fingerprintLength
  return { fingerprintedName, name, nameLength, fingerprint, fingerprintLength, totalLength }
} 

export const toPrimaryName = (name: Name) : PrimaryName => {
  if (!isName(name)) {
    throw new Error("Invalid Name")
  }
  return nameToPrimaryChars(name)
}

export const nameBelongsToPrimaryKey = async (name: Name | FingerprintedName, primaryKey: PrimaryKey): Promise<boolean> => {
  if (isFingerprintedName(name)) {
    const [n, fingerprint] = splitFingerprintedName(name)
    const fingerprintKey = await primaryKeyToFingerprint(primaryKey)
    return primaryKey.startsWith(nameToPrimaryChars(n)) && fingerprintKey.startsWith(fingerprint)
  } else {
    return primaryKey.startsWith(nameToPrimaryChars(name))
  }
}

export const primaryKeyToFingerprint = async (primaryKey: PrimaryKey): Promise<Fingerprint> => {
  if (!isPrimaryKey(primaryKey)) {
    throw new Error("Invalid PrimaryKey")
  }
  const publicKey = primaryKeyToPublicKey(primaryKey)
  return await publicKeyToFingerprint(publicKey)
}

export const sliceFingerprint = (fingerprint: Fingerprint, length?: number): Fingerprint => {
  if (!isFingerprint(fingerprint)) {
    throw new Error("Invalid Fingerprint")
  }
  if (length === undefined) {
    return fingerprint
  }
  return Array.from(fingerprint).slice(0, length).join("")
}

export const primaryKeyToFingerprintedName = async (primaryKey: PrimaryKey, name: Name, fingerprintLength?: number): Promise<FingerprintedName> => {
  if (await nameBelongsToPrimaryKey(name, primaryKey) === false) {
    throw new Error("Name does not belong to PrimaryKey")
  }
  const l = MIN_FINGERPRINTED_NAME_LENGTH - name.length
  const length = fingerprintLength ?? ((l >= MIN_FINGERPRINT_LENGTH) ? l : MIN_FINGERPRINT_LENGTH)
  const fingerprint = await primaryKeyToFingerprint(primaryKey)
  const subFingerprint = sliceFingerprint(fingerprint, length)
  return `${ name }${ subFingerprint }`
}

export const fingerprintBelongsToPrimaryKey = async (primaryKey: PrimaryKey, fingerprint: Fingerprint): Promise<boolean> => {
  if (!isPrimaryKey(primaryKey)) {
    throw new Error("Invalid PrimaryKey")
  }
  if (!isFingerprint(fingerprint)) {
    throw new Error("Invalid Fingerprint")
  }
  const primaryKeyFingerprint = await primaryKeyToFingerprint(primaryKey)
  return primaryKeyFingerprint.startsWith(fingerprint)
}