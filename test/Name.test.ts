import { assertEquals } from "@std/assert"
import { 
  isName, 
  isFingerprint, 
  isAcceptedName, 
  isNameOrFingerprintedName, 
  isFingerprintedName, 
  analyzeFingerprintedName, 
  nameBelongsToPrimaryKey, 
  primaryKeyToFingerprint, 
  toPrimaryName, 
  displayFingerprint,
  normalizeFingerprint
} from "../Name.ts"
import mockData from "./data.mock.ts"

Deno.test("isName", () => {
  // Valid names
  assertEquals(isName("mike"), true)
  assertEquals(isName("MikeS"), true)
  
  // Invalid cases
  assertEquals(isName(""), false) // Empty string not allowed
  assertEquals(isName("Mike!"), false) // Special characters not allowed
})

Deno.test("normalizeFingerprint", () => {
  assertEquals(normalizeFingerprint("❤️✈️⚡️☕️☀️️☔☁️✒"), "❤✈⚡☕☀☔☁✒")
})

Deno.test("displayFingerprint", () => {
  assertEquals(displayFingerprint("❤☃✈⚡☕☀☔☁"), "❤️☃️✈️⚡️☕️☀️☔️☁️")
})

Deno.test("isFingerprint", () => {
  // Valid fingerprints (emojis)
  assertEquals(isFingerprint("😀"), true)
  assertEquals(isFingerprint("☁🎄"), true)
  assertEquals(isFingerprint("☁🎄🌙☃🍴⚽"), true)

  // Invalid cases
  assertEquals(isFingerprint(""), false) // Empty string not allowed
  assertEquals(isFingerprint("Abc"), false) // Letters not allowed
  assertEquals(isFingerprint("123"), false) // Numbers not allowed
})

Deno.test("toPrimaryName", () => {
  assertEquals(toPrimaryName("M1KE"), "M1KE")
  assertEquals(toPrimaryName("Mike"), "M1KE")
})

Deno.test("isFingerprintedName", () => {
  // Valid fingerprinted names
  assertEquals(isFingerprintedName("Mike😀"), true)
  assertEquals(isFingerprintedName("Anna🎄"), true)
  assertEquals(isFingerprintedName("John☁🎄"), true)
  assertEquals(isFingerprintedName("1Mike😀"), true) // Name starting with number

  // Invalid cases
  assertEquals(isFingerprintedName("Mike"), false) // No fingerprint
  assertEquals(isFingerprintedName(""), false) // Empty string
  assertEquals(isFingerprintedName("$😀"), false) // Invalid name
  assertEquals(isFingerprintedName(null), false) // Null value
})

Deno.test("isAcceptedName", () => {
  // Names with length >= 4
  assertEquals(isAcceptedName("Mike"), true)
  assertEquals(isAcceptedName("Anna🌲"), true)
  assertEquals(isAcceptedName("John☁🌲"), true)

  // Names with length < 4
  assertEquals(isAcceptedName(""), false)
  assertEquals(isAcceptedName("Tom"), false)
  assertEquals(isAcceptedName("Al"), false)
})

Deno.test("isNameOrFingerprintedName", () => {
  assertEquals(isNameOrFingerprintedName("Mike"), true)
  assertEquals(isNameOrFingerprintedName("Mike😀"), true)
  assertEquals(isNameOrFingerprintedName("Mike❤✒☀☕⚡🔥"), true)
  assertEquals(isNameOrFingerprintedName(""), false)
  assertEquals(isNameOrFingerprintedName("Mike!"), false)
  assertEquals(isNameOrFingerprintedName("😀"), false)
})

Deno.test("analyzeFingerprintedName", () => {
  const result = analyzeFingerprintedName("Mike😀")
  assertEquals(result.name, "Mike")
  assertEquals(result.fingerprint, "😀")
  assertEquals(result.fingerprintedName, "Mike😀")
  assertEquals(result.nameLength, 4)
  assertEquals(result.fingerprintLength, 1)
  assertEquals(result.totalLength, 5)
  assertEquals(analyzeFingerprintedName("Mike❤✒☀☕⚡🔥").fingerprintLength, 6)
})

Deno.test("primaryKeyToFingerprint", async () => {
  const primaryKey = mockData[0].primaryKey
  const fingerprint = await primaryKeyToFingerprint(primaryKey)
  assertEquals(fingerprint, mockData[0].fingerprint)
})

Deno.test("nameBelongsToPrimaryKey", async () => {
  // The name "Mike" should match the start of its primary chars
  assertEquals(await nameBelongsToPrimaryKey("Mike", "M1KEXYZABCDEFGHIJKLMNOPQRSTUVWX1234567890ABCDEFGH3"), true)
  // The name "Anna" should not match a primary key starting with "M1KE"
  assertEquals(await nameBelongsToPrimaryKey("Anna", "M1KEXYZABCDEFGHIJKLMNOPQRSTUVWX1234567890ABCDEFGH3"), false)
  // Fingerprinted name
  assertEquals(await nameBelongsToPrimaryKey(mockData[0].name, mockData[0].primaryKey), true)
  assertEquals(await nameBelongsToPrimaryKey(mockData[1].name, mockData[1].primaryKey), true)
})

Deno.test("primaryKeyToFingerprintedName", async () => {
  //assertEquals(await primaryKeyToFingerprintedName(mockData[0].primaryKey, mockData[0].name), mockData[0].fingerprintedName)
  //assertEquals(await primaryKeyToFingerprintedName(mockData[1].primaryKey, mockData[1].name), mockData[1].fingerprintedName)
})
