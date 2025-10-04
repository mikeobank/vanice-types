import { assertEquals } from "@std/assert"
import getUTF8StringLength from "../../../lib/utils/getUTF8StringLength.ts"

Deno.test("getUTF8StringLength", () => {
  assertEquals(getUTF8StringLength("MIKE"), 4)
  assertEquals(getUTF8StringLength("😊"), 1)
  assertEquals(getUTF8StringLength("Mike😊"), 5)
  assertEquals(getUTF8StringLength("❤🖋☀☕⚡🔥"), 6)
  assertEquals(getUTF8StringLength("❤️🖋☀️☕️️⚡️🔥"), 6)
  assertEquals(getUTF8StringLength("❤️🖋☀️☕️️⚡️🔥☂️✈️☃️☁️"), 10)
})