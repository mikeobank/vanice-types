import { assert, assertEquals, assertFalse } from "@std/assert"
import { compareFingerprints, displayFingerprint, fingerprintStartsWithFingerprint, getFingerprintDisplayLength, getFingerprintLength, isFingerprint, isFingerprintDisplay, isNormalizedFingerprintDisplay, normalizeFingerprintDisplay, parseFingerprint, sliceFingerprint } from "../Fingerprint.ts"

Deno.test("parseFingerprint", () => {
  assertEquals(parseFingerprint("😀"), [0])
  assertEquals(parseFingerprint("⏰😀☂️☔️❤"), [31, 0, 27, 27, 3])
})

Deno.test("isFingerprint", () => {
  assert(isFingerprint([4]))
  assert(isFingerprint([4, 31, 5]))
  assertFalse(isFingerprint([]))
})

Deno.test("getFingerprintLength", () => {
  assertEquals(3, getFingerprintLength([1, 2, 3]))
})

Deno.test("compareFingerprints", () => {
  assert(compareFingerprints([1, 2, 3], [1, 2, 3]))
  assertFalse(compareFingerprints([1, 2, 3, 4], [1, 2, 3]))
})

Deno.test("fingerprintStartsWithFingerprint", () => {
  assert(fingerprintStartsWithFingerprint([1, 2, 3], [1]))
  assertFalse(fingerprintStartsWithFingerprint([31, 2, 3], [22]))
})

Deno.test("sliceFingerprint", () => {
  assertEquals(sliceFingerprint([1, 2, 3], 2), [1, 2])
})

Deno.test("isFingerprintDisplay", () => {
  assert(isFingerprintDisplay("⏰😀☂️☔️❤"))
})

Deno.test("displayFingerprint", () => {
  assertEquals(displayFingerprint([31, 0, 27, 27, 3]), "⏰😀☔️☔️❤️")
})

Deno.test("getFingerprintDisplayLength", () => {
  assertEquals(5, getFingerprintDisplayLength("⏰😀☔️☔️❤️"))
})

Deno.test("isNormalizedFingerprintDisplay", () => {
  assertFalse(isNormalizedFingerprintDisplay("⏰😀☂️☔️❤"))
  assert(isNormalizedFingerprintDisplay("⏰😀☔️☔️❤️"))
})

Deno.test("normalizeFingerprintDisplay", () => {
  assertEquals(normalizeFingerprintDisplay("⏰😀☂️☔️❤"), "⏰😀☔️☔️❤️")
})
