import { isFlag, primaryKeyToPublicKey, publicKeyToFingerprint } from "./PublicKey.ts"
import { fingerprintStartsWithFingerprint, isFingerprint, type Fingerprint } from "./Fingerprint.ts"
import { primaryCharsRegex } from "./lib/characters.ts"
import isString from "./lib/utils/isString.ts"

export type PrimaryChars = string 
export type PrimaryKey = string

export const isPrimaryChars = (value: unknown): value is PrimaryChars => {
  return isString(value) && primaryCharsRegex.test(value)
}

export const isPrimaryKey = (value: unknown): value is PrimaryKey => {
  return isPrimaryChars(value) && value.length === 53 && isFlag(parseInt(value[value.length - 1], 10))
}

export const primaryKeyToFingerprint = async (primaryKey: PrimaryKey): Promise<Fingerprint> => {
  if (!isPrimaryKey(primaryKey)) {
    throw new Error("Invalid PrimaryKey")
  }
  const publicKey = primaryKeyToPublicKey(primaryKey)
  return await publicKeyToFingerprint(publicKey)
}

export const fingerprintBelongsToPrimaryKey = async (primaryKey: PrimaryKey, fingerprint: Fingerprint): Promise<boolean> => {
  if (!isPrimaryKey(primaryKey)) {
    throw new Error("Invalid PrimaryKey")
  }
  if (!isFingerprint(fingerprint)) {
    throw new Error("Invalid Fingerprint")
  }
  const primaryKeyFingerprint = await primaryKeyToFingerprint(primaryKey)
  return fingerprintStartsWithFingerprint(primaryKeyFingerprint, fingerprint)
}
