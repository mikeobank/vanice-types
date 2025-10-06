import { assertEquals } from "@std/assert/equals"
import splitEmojiString from "../../../lib/utils/splitEmojiString.ts"

Deno.test("splitEmojiString", () => {
  assertEquals(splitEmojiString("👨‍👩‍👧‍👦🏳️‍🌈👍🏽🇺🇸"), ["👨‍👩‍👧‍👦", "🏳️‍🌈", "👍🏽", "🇺🇸"]) // multi-codepoint emojis
  assertEquals(splitEmojiString("😀❤⏰❤️☔"), ["😀", "❤", "⏰", "❤️", "☔"]) // fingerprint emojis
})