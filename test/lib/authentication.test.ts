import { assertEquals } from "@std/assert"
import { getPublicKey } from "@noble/secp256k1"
import { generateKeyPair, sign, verify } from "../../lib/authentication.ts"
import { publicKeyToPrimaryKey } from "../../PublicKey.ts"

Deno.test("sign and verify roundtrip", async () => {

  // Test data
  const name = "XY0"
  const privateKey = new Uint8Array([
    228, 204, 24,   2, 214,   9, 156, 252,
    180,  69,  7, 125,  40,   6, 208, 146,
    120, 219,  5, 121, 122, 219, 230, 217,
    217, 200, 75, 158, 255, 172,  94,  76
  ])
  const publicKey = getPublicKey(privateKey)
  const primaryKey = publicKeyToPrimaryKey(publicKey)

  // Sign the data
  const signature = await sign(primaryKey, name, privateKey)
  
  // Verify the signature
  const isValid = verify(primaryKey, name, signature)
  assertEquals(isValid, true)

  // Verify fails with wrong name
  const isInvalid = verify(primaryKey, "john", signature)
  assertEquals(isInvalid, false)
})

  Deno.test("generateKeyPair", () => {
    const [privateKey, publicKey] = generateKeyPair()
    assertEquals(privateKey instanceof Uint8Array, true)
    assertEquals(publicKey instanceof Uint8Array, true)
  })