import characters from '../../lib/characters.json' with { type: "json" }
import { assertEquals } from "@std/assert"

const codePointToHex = (codePoint: string) => {
  return Number(codePoint.replace("U+", "0x"))
}

characters.forEach((char) => {
  char.fingerprint.forEach(f => assertEquals(f.character, String.fromCodePoint(...f.codePoints.map(codePointToHex))))
})