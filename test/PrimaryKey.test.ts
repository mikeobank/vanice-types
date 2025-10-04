import { assertEquals, assertThrows } from "@std/assert"
import { isPrimaryKey } from "../PrimaryKey.ts"
import { splitFingerprintedName } from "../Name.ts"

Deno.test("isPrimaryKey", () => {
  // Valid primary key (53 characters)
  assertEquals(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4G3"), true)
  
  // Invalid cases
  assertEquals(isPrimaryKey(null), false)
  assertEquals(isPrimaryKey(""), false)
  assertEquals(isPrimaryKey("M1K"), false)
  assertEquals(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4G"), false) // No flag
  assertEquals(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4G5"), false) // Invalid flag
  assertEquals(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4GA2"), false) // One character too long
})

Deno.test("PrimaryKey", () => {
  assertEquals(splitFingerprintedName("Mike😀"), ["Mike", "😀"])
  assertThrows(() => splitFingerprintedName("Mike"))
  assertThrows(() => splitFingerprintedName("$"))
  assertThrows(() => splitFingerprintedName("$😀"))
  assertThrows(() => splitFingerprintedName(""))
})
