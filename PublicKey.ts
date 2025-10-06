import { type PrimaryKey, isPrimaryKey } from "./PrimaryKey.ts"
import type { Fingerprint } from "./Fingerprint.ts"
import isUint8Array from "./lib/utils/isUint8Array.ts"
import isNumber from "./lib/utils/isNumber.ts"
import { hashToFingerprint, primaryCharsToUint8Array, publicKeyToPrimaryChars } from "./lib/codec.ts"
import { digest } from "./lib/digest.ts"
import { type HexString, displayHex } from "./lib/utils/displayHex.ts"

export { type Signature, isSignature, sign, verify, generateKeyPair } from "./lib/authentication.ts"

export type PrivateKey = Uint8Array
export type PublicKey = Uint8Array
export type Flag = 2 | 3

export const isFlag = (value: unknown): value is Flag => {
  return isNumber(value) && (value === 2 || value === 3)
}

export const readFlagFromPublicKey = (publicKey: PublicKey): Flag => {
  const flag = publicKey[0]
  if (isFlag(flag) === false) {
    throw new Error("Invalid PublicKey flag")
  }
  return flag
}

export const isPublicKey = (value: unknown): value is PublicKey => {
  return isUint8Array(value) && value.length === 33 && isFlag(value[0])
}

const splitPublicKey = (publicKey: PublicKey): [Flag, Uint8Array] => {
  if (isPublicKey(publicKey) === false) {
    throw new Error("Invalid PublicKey")
  }
  const flag = publicKey[0]
  if (isFlag(flag) === false) {
    throw new Error("Invalid PublicKey flag")
  }
  const data = publicKey.subarray(1)
  return [flag, data]
}

const splitPrimaryKey = (primaryKey: PrimaryKey): [Flag, string] => {
  if (isPrimaryKey(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey")
  }
  const flag = parseInt(primaryKey[primaryKey.length - 1], 10)
  if (isFlag(flag) === false) {
    throw new Error("Invalid PrimaryKey flag")
  }
  const s = primaryKey.slice(0, -1)
  return [flag, s]
}

const prependFlagToPublicKey = (arr: Uint8Array, flag: Flag): PublicKey => {
  return new Uint8Array([flag, ...arr])
}

const appendFlagToPrimaryKey = (s: string, flag: Flag): PrimaryKey => {
  return `${ s }${ flag }`
}

export const publicKeyToPrimaryKey = (publicKey: PublicKey): PrimaryKey => {
  if (isPublicKey(publicKey) === false) {
    throw new Error("Invalid PublicKey")
  }
  const [flag, data] = splitPublicKey(publicKey)
  return appendFlagToPrimaryKey(publicKeyToPrimaryChars(data), flag)
}

export const primaryKeyToPublicKey = (primaryKey: PrimaryKey): PublicKey => {
  if (isPrimaryKey(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey")
  }
  const [flag, s] = splitPrimaryKey(primaryKey)
  return prependFlagToPublicKey(primaryCharsToUint8Array(s), flag)
}

export const publicKeyToFingerprint = async (publicKey: PublicKey): Promise<Fingerprint> => {
  return hashToFingerprint(await digest(publicKey))
}

const displayKey = (key: Uint8Array): HexString => {
  return displayHex(key)
}

export const displayPublicKey = (publicKey: PublicKey): HexString => {
  return displayKey(publicKey)
}

export const displayPrivateKey = (privateKey: PublicKey): HexString => {
  return displayKey(privateKey)
}

