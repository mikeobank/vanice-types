import { assertEquals } from "@std/assert"
import { displayEmoji, displayEmojis, normalizeEmoji, normalizeEmojis } from "../lib/characters.ts"

Deno.test("normalizeEmoji", () => {
  assertEquals(normalizeEmoji("❤️"), "❤")
  assertEquals(normalizeEmoji("✈️"), "✈")
  assertEquals(normalizeEmoji("⚡️"), "⚡")
  assertEquals(normalizeEmoji("☕️"), "☕")
  assertEquals(normalizeEmoji("☀️"), "☀")
  assertEquals(normalizeEmoji("☔"), "☔")
  assertEquals(normalizeEmoji("☁️"), "☁")
  assertEquals(normalizeEmoji("✒"), "✒")
  assertEquals(normalizeEmoji("☃️"), "☃")
  assertEquals(normalizeEmoji("😀"), "😀")
})

Deno.test("normalizeEmojis", () => {
  assertEquals(normalizeEmojis("❤️✈️⚡️☕️☀️️☔☁️️✒"), "❤✈⚡☕☀☔☁✒")
})

Deno.test("displayEmoji", () => {
  assertEquals(displayEmoji("❤"), "❤️")
  assertEquals(displayEmoji("✈"), "✈️")
  assertEquals(displayEmoji("⚡"), "⚡️")
  assertEquals(displayEmoji("☕"), "☕️")
  assertEquals(displayEmoji("☀"), "☀️")
  assertEquals(displayEmoji("☔"), "☔️")
  assertEquals(displayEmoji("☁"), "☁️")
  assertEquals(displayEmoji("✒"), "✒️")
  assertEquals(displayEmoji("☃"), "☃️")
  assertEquals(displayEmoji("😀"), "😀")
})

Deno.test("displayEmojis", () => {
  assertEquals(displayEmojis("❤✈⚡☕☀☔☁✒☃😀"), "❤️✈️⚡️☕️☀️☔️☁️✒️☃️😀")
})