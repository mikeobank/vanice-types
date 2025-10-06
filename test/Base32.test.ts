import { assertEquals } from "@std/assert"
import { encode, decode, uint8ArrayToBase32Array, base32ToUint8Array } from "../lib/Base32.ts"
import { primaryAlphabet } from "../lib/characters.ts"

Deno.test("base32 encode, decode", () => {
  const arr = new Uint8Array([177, 70])
  const base32Arr = uint8ArrayToBase32Array(arr)
  assertEquals(base32Arr, [22, 5, 3, 0])
  const arr_ = base32ToUint8Array(base32Arr)
  assertEquals(arr_, arr)
})

Deno.test("base32 encode, decode", () => {
  const arr32 = [22, 5, 3, 16]
  const arr = base32ToUint8Array(arr32)
  assertEquals(arr, new Uint8Array([177, 71]))
  const arr32_ = uint8ArrayToBase32Array(arr)
  assertEquals(arr32_, arr32)
})

Deno.test("encoding roundtrip primaryAlphabet", () => {
  const original = uint8ArrayToBase32Array(new Uint8Array(32).fill(1))
  const encoded = encode(original, primaryAlphabet)
  const decoded = decode(encoded, primaryAlphabet)
  assertEquals(decoded, original)
})
