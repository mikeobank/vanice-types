export const digest = async (arr: Uint8Array): Promise<Uint8Array> => {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new Uint8Array(arr)))
}