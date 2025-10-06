import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert"
import { 
  isName, 
  isAcceptedName, 
  isNameOrFingerprintedName, 
  isFingerprintedName, 
  analyzeFingerprintedName, 
  nameBelongsToPrimaryKey, 
  toPrimaryName,
  splitFingerprintedName,
  primaryKeyToFingerprintedName
} from "../Name.ts"
import mockData from "./data.mock.ts"

Deno.test("isName", () => {
  // Valid names
  assert(isName("mike"))
  assert(isName("MikeS"))
  
  // Invalid cases
  assertFalse(isName("")) // Empty string not allowed
  assertFalse(isName("Mike!")) // Special characters not allowed
})

Deno.test("toPrimaryName", () => {
  assertEquals(toPrimaryName("M1KE"), "M1KE")
  assertEquals(toPrimaryName("Mike"), "M1KE")
})

Deno.test("isFingerprintedName", () => {
  // Valid fingerprinted names
  assert(isFingerprintedName("Mike😀"))
  assert(isFingerprintedName("Anna🎄"))
  assert(isFingerprintedName("John☁🎄"))
  assert(isFingerprintedName("1Mike😀")) // Name starting with number

  // Invalid cases
  assertFalse(isFingerprintedName("Mike")) // No fingerprint
  assertFalse(isFingerprintedName("")) // Empty string
  assertFalse(isFingerprintedName("$😀")) // Invalid name
  assertFalse(isFingerprintedName(null)) // Null value
})

Deno.test("isAcceptedName", () => {
  // Names with length >= 4
  assert(isAcceptedName("Mike"))
  assert(isAcceptedName("Anna🌲"))
  assert(isAcceptedName("John☁🌲"))

  // Names with length < 4
  assertFalse(isAcceptedName(""))
  assertFalse(isAcceptedName("Tom"))
  assertFalse(isAcceptedName("Al"))
})

Deno.test("isNameOrFingerprintedName", () => {
  assert(isNameOrFingerprintedName("Mike"))
  assert(isNameOrFingerprintedName("Mike😀"))
  assert(isNameOrFingerprintedName("Mike❤✒☀☕⚡🔥"))
  assertFalse(isNameOrFingerprintedName(""))
  assertFalse(isNameOrFingerprintedName("Mike!"))
  assertFalse(isNameOrFingerprintedName("😀"))
})

Deno.test("splitFingerprintedName", () => {
  const [name, fingerprintDisplay] = splitFingerprintedName("Mike😀")
  assertEquals(name, "Mike")
  assertEquals(fingerprintDisplay, "😀")
  assertThrows(() => splitFingerprintedName("Mike"))
  assertThrows(() => splitFingerprintedName("$"))
  assertThrows(() => splitFingerprintedName("$😀"))
  assertThrows(() => splitFingerprintedName(""))
})

Deno.test("analyzeFingerprintedName", () => {
  const result = analyzeFingerprintedName("Mike😀")
  assertEquals(result.name, "Mike")
  assertEquals(result.fingerprintDisplay, "😀")
  assertEquals(result.fingerprintedName, "Mike😀")
  assertEquals(result.nameLength, 4)
  assertEquals(result.fingerprintLength, 1)
  assertEquals(result.totalLength, 5)
  assertEquals(analyzeFingerprintedName("Mike❤✒☀☕⚡🔥").fingerprintLength, 6)
})

Deno.test("nameBelongsToPrimaryKey", async () => {
  // The name "Mike" should match the start of its primary chars
  assert(await nameBelongsToPrimaryKey("Mike", "M1KEXYZABCDEFGHIJKLMNOPQRSTUVWX1234567890ABCDEFGH3"))
  // The name "Anna" should not match a primary key starting with "M1KE"
  assertFalse(await nameBelongsToPrimaryKey("Anna", "M1KEXYZABCDEFGHIJKLMNOPQRSTUVWX1234567890ABCDEFGH3"))
  // Fingerprinted name
  assert(await nameBelongsToPrimaryKey(mockData[0].name, mockData[0].primaryKey))
  assert(await nameBelongsToPrimaryKey(mockData[1].name, mockData[1].primaryKey))
})

Deno.test("primaryKeyToFingerprintedName", async () => {
  assertEquals(await primaryKeyToFingerprintedName(mockData[0].primaryKey, mockData[0].name), mockData[0].fingerprintedName)
  assertEquals(await primaryKeyToFingerprintedName(mockData[1].primaryKey, mockData[1].name), mockData[1].fingerprintedName)
})
