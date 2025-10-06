export type HexString = string
export const displayHex = (arr: Uint8Array) : HexString => {
  return Array.from(arr)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("")
}