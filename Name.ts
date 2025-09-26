import { fingerprintCharsRegex, nameRegex, nameStartRegex } from "./lib/characterRegexes.ts"
import { hashToPrimaryChars, nameToPrimaryChars, primaryCharsToFingerprint } from "./lib/toPrimaryChars.ts"
import isString from "./lib/utils/isString.ts"
import getUTF8StringLength from "./lib/utils/getUTF8StringLength.ts"
import { type PrimaryKey, type PrimaryChars, isPrimaryKey } from "./PrimaryKey.ts"

export type Name = string
export type PrimaryName = PrimaryChars
export type Fingerprint = string
export type FingerprintedName = `${ Name }${ Fingerprint }`
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

export const isFingerprint = (value: unknown): value is Fingerprint => {
  return isString(value) && value.length > 0 && fingerprintCharsRegex.test(value)
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

export const nameBelongsToPrimaryKey = async (name: Name | FingerprintedName, primaryKey: PrimaryKey): Promise<boolean> => {
  if (isFingerprintedName(name)) {
    const [n, fingerprint] = splitFingerprintedName(name)
    const fingerprintKey = await primaryKeyToFingerprint(primaryKey)
    return primaryKey.startsWith(nameToPrimaryChars(n)) && fingerprintKey.startsWith(fingerprint)
  } else {
    return primaryKey.startsWith(nameToPrimaryChars(name))
  }
}

export const primaryKeyToFingerprint = async (primaryKey: PrimaryKey, l?: number): Promise<Fingerprint> => {
  if (!isPrimaryKey(primaryKey)) {
    throw new Error("Invalid PrimaryKey")
  }
  const primaryChars = await hashToPrimaryChars(primaryKey)
  const s = l ? primaryChars.slice(0, l) : primaryChars
  return primaryCharsToFingerprint(s)
}

export const primaryKeyToFingerprintedName = async (primaryKey: PrimaryKey, name: Name, fingerprintLength?: number): Promise<FingerprintedName> => {
  if (await nameBelongsToPrimaryKey(name, primaryKey) === false) {
    throw new Error("Name does not belong to PrimaryKey")
  }
  const l = MIN_FINGERPRINTED_NAME_LENGTH - name.length
  const length = fingerprintLength ?? ((l >= MIN_FINGERPRINT_LENGTH) ? l : MIN_FINGERPRINT_LENGTH)
  const fingerprint = await primaryKeyToFingerprint(primaryKey, length)
  return `${ name }${ fingerprint }`
}