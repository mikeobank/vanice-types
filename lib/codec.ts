import characters from "./characters.json" with { type: "json" }
import type { Fingerprint, Name } from "../Name.ts"
import type { PrimaryChars } from "../PrimaryKey.ts"
import type { PublicKey } from "../PublicKey.ts"
import { base32ToUint8Array, decode, encode, uint8ArrayToBase32Array } from "./Base32.ts"
import { fingerprintAlphabet, primaryAlphabet } from "./characters.ts"

export const hashToFingerprint = (hash: Uint8Array): Fingerprint => {
  return encode(uint8ArrayToBase32Array(hash), fingerprintAlphabet)
}

export const publicKeyToPrimaryChars = (publicKey: PublicKey): PrimaryChars => {
  return encode(uint8ArrayToBase32Array(publicKey), primaryAlphabet)
}

export const primaryCharsToUint8Array = (chars: PrimaryChars): Uint8Array => {
  return base32ToUint8Array(decode(chars, primaryAlphabet))
}

export const nameToPrimaryChars = (name: Name) : PrimaryChars => {
  return Array.from(name)
    .map(char => characters.find(({ secondary }) => secondary.includes(char))?.primary ?? char)
    .join("")
}