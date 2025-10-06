import { assertEquals } from "@std/assert"
import { getFingerprintIndex, getFingerprintChar } from "../lib/characters.ts"

Deno.test("getFingerprintIndex", () => {
  // Test with valid characters
  assertEquals(getFingerprintIndex("😀"), 0)
  assertEquals(getFingerprintIndex("🎄"), 26)
  assertEquals(getFingerprintIndex("☁"), 30)
})

Deno.test("getFingerprintChar", () => {
  // Test with valid indices
  assertEquals(getFingerprintChar(0), "😀")
  assertEquals(getFingerprintChar(26), "🎄")
  assertEquals(getFingerprintChar(30), "☁️")
})
