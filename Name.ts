import { type PrimaryKey, type PrimaryChars, primaryKeyToFingerprint } from "./PrimaryKey.ts"
import { displayFingerprint, type Fingerprint, type FingerprintDisplay, fingerprintStartsWithFingerprint, getFingerprintLength, normalizeFingerprintDisplay, parseFingerprint, sliceFingerprint } from "./Fingerprint.ts"
import { nameRegex, nameStartRegex } from "./lib/characters.ts"
import { nameToPrimaryChars } from "./lib/codec.ts"
import isString from "./lib/utils/isString.ts"

export type Name = string
export type PrimaryName = PrimaryChars
export type FingerprintedName = `${ Name }${ FingerprintDisplay }`
type AnalyzedName = {
  name: Name
  fingerprintedName: FingerprintedName, 
  nameLength: number
  fingerprintDisplay: FingerprintDisplay
  fingerprintDisplayNormalized: FingerprintDisplay
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

export const toPrimaryName = (name: Name) : PrimaryName => {
  if (!isName(name)) {
    throw new Error("Invalid Name")
  }
  return nameToPrimaryChars(name)
}

export const splitFingerprintedName = (fingerprintedName: FingerprintedName): [Name, FingerprintDisplay, Fingerprint] => {
  const match = fingerprintedName.match(nameStartRegex)
  if (match === null) {
    throw new Error("Invalid fingerprinted name")
  }
  const name = match[0]
  if (!isName(name)) {
    throw new Error("Invalid fingerprinted name")
  }
  const fingerprintDisplay = fingerprintedName.slice(name.length)
  if (fingerprintDisplay.length === 0) {
    throw new Error("Invalid fingerprinted name")
  }
  const fingerprint = parseFingerprint(fingerprintDisplay)
  return [name, fingerprintDisplay, fingerprint]
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
  const [name, fingerprintDisplay, fingerprint] = splitFingerprintedName(fingerprintedName)
  const nameLength = name.length
  const fingerprintDisplayNormalized = normalizeFingerprintDisplay(fingerprintDisplay)
  const fingerprintLength = getFingerprintLength(fingerprint)
  const totalLength = nameLength + fingerprintLength
  return { fingerprintedName, name, nameLength, fingerprintDisplay, fingerprintDisplayNormalized, fingerprint, fingerprintLength, totalLength }
} 

export const nameBelongsToPrimaryKey = async (name: Name | FingerprintedName, primaryKey: PrimaryKey): Promise<boolean> => {
  if (isFingerprintedName(name)) {
    const [n,, f] = splitFingerprintedName(name)
    const fingerprint = await primaryKeyToFingerprint(primaryKey)
    return primaryKey.startsWith(nameToPrimaryChars(n)) && fingerprintStartsWithFingerprint(fingerprint, f)
  } else {
    return primaryKey.startsWith(nameToPrimaryChars(name))
  }
}

export const primaryKeyToFingerprintedName = async (primaryKey: PrimaryKey, name: Name, fingerprintLength?: number): Promise<FingerprintedName> => {
  if (await nameBelongsToPrimaryKey(name, primaryKey) === false) {
    throw new Error("Name does not belong to PrimaryKey")
  }
  const l = MIN_FINGERPRINTED_NAME_LENGTH - name.length
  const length = fingerprintLength ?? ((l >= MIN_FINGERPRINT_LENGTH) ? l : MIN_FINGERPRINT_LENGTH)
  const fingerprint = await primaryKeyToFingerprint(primaryKey)
  const fingerprintDisplay = displayFingerprint(sliceFingerprint(fingerprint, length))
  return `${ name }${ fingerprintDisplay }`
}

