import { isFlag } from "./PublicKey.ts"
import { primaryCharsRegex } from "./lib/characters.ts"
import isString from "./lib/utils/isString.ts"

export type PrimaryChars = string 
export type PrimaryKey = string

export const isPrimaryChars = (value: unknown): value is PrimaryChars => {
  return isString(value) && primaryCharsRegex.test(value)
}

export const isPrimaryKey = (value: unknown): value is PrimaryKey => {
  return isPrimaryChars(value) && value.length === 53 && isFlag(parseInt(value[value.length - 1], 10))
}
