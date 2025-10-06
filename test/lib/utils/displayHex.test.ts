import { assertEquals } from "@std/assert"
import { displayHex } from "../../../lib/utils/displayHex.ts"

Deno.test("displayHex", () => {
  const arr = new Uint8Array([0, 1, 2, 3, 4, 5, 10, 15, 16, 255])
  const hex = displayHex(arr)
  assertEquals(hex, "0001020304050a0f10ff")
})
  
