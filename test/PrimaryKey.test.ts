import { assert, assertFalse, assertEquals } from "@std/assert"
import { isPrimaryKey, primaryKeyToFingerprint } from "../PrimaryKey.ts"
import mockData from "./data.mock.ts"

Deno.test("isPrimaryKey", () => {
  // Valid primary key (53 characters)
  assert(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4G3"))
  
  // Invalid cases
  assertFalse(isPrimaryKey(null))
  assertFalse(isPrimaryKey(""))
  assertFalse(isPrimaryKey("M1K"))
  assertFalse(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4G")) // No flag
  assertFalse(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4G5")) // Invalid flag
  assertFalse(isPrimaryKey("M1KABKCN21R65CU8HB736HNYJG0G1UQC4XX2VCAJNPBKVRG3PF4GA2")) // One character too long
})

Deno.test("primaryKeyToFingerprint", async () => {
  const primaryKey = mockData[0].primaryKey
  const fingerprint = await primaryKeyToFingerprint(primaryKey)
  assertEquals(fingerprint, mockData[0].fingerprint)
})

