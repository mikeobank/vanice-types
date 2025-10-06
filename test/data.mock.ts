export default [
{ 
  privateKey: new Uint8Array([
    30,  38, 118, 159, 239, 195,  62,   6,
    205,   8, 202,  74, 142, 212, 251,  73,
    43,  66,  18, 129, 193, 124, 132, 145,
    200, 111,  59, 219, 159, 251,   3, 147
  ]),
  publicKey: new Uint8Array([
    3, 226, 170, 22,   9, 101, 114, 99,
    43, 218, 114, 83, 102, 201, 131, 45,
    28,  15, 231, 70, 175, 254, 125, 62,
    90, 233, 103, 50, 103, 117,  16, 13,
    74
  ]),
  name: "Vanic",
  primaryName: "VAN1C",
  primaryKey: "VAN1C2B5E9HJQPKJADKCK0SD3G7XEHNFYSXKVPQ9CVS6EW8G1N503",
  fingerprint: [
    31, 14,  4,  2, 12, 17, 26, 29, 19, 17,  5,
    28, 14, 24, 20, 25, 29, 21, 10, 10,  9,  9,
    13,  5,  8, 10, 14, 11, 24, 30, 11, 31, 23,
    4,  8, 14, 23,  9, 17, 28,  8, 29, 17, 18,
    29, 21, 20, 14, 26, 13,  3, 16
  ],
  fingerprintDisplay: "⏰⚡️💪🍴🚗🏠🎄🦋👑🏠⭐🌸⚡️🚀🎵☀️🦋💡✈️✈️🏁🏁🌙⭐☃️✈️⚡️⚽🚀☁️⚽⏰☕️💪☃️⚡️☕️🏁🏠🌸☃️🦋🏠🔑🦋💡🎵⚡️🎄🌙❤️🎁",
  fingerprintedName: "Vanic⏰⚡️💪🍴🚗"
},
{
  privateKey: new Uint8Array([
    187, 255,  60, 249, 208, 160, 180,  21,
    226,  42,  38, 249, 135, 227,  81,  11,
    167, 218,  44,  50,  22, 173,  62,  37,
    71,  45, 235, 167,  91,   3, 251, 202
  ]),
  publicKey: new Uint8Array([
      3, 160, 102, 237, 164, 189, 228,  79,
     58, 180, 122, 219, 207,  21,  68,  10,
    124, 132, 224, 153, 107,  66,  40,  58,
    124, 114, 201, 255, 164,  17, 148, 233,
     38
  ]),
  name: "Mike",
  primaryName: "MIKE",
  primaryKey: "M1KEU95WVH7KND3TUF7HAH0AFJ2E16BB88M3MY3JS7YT84CMW4K03",
  fingerprint: [
    10,  3, 21,  9, 17,  4, 26, 23, 19, 11, 15,
    7,  9, 30,  6, 22, 16, 14,  7,  3, 18,  9,
    18,  1, 24, 16,  8, 27, 28,  4, 28,  0, 10,
    5, 20, 14, 27,  4, 23, 10, 16,  9,  9, 21,
    24, 28,  0,  6, 28, 24, 25,  0
  ],
  fingerprintDisplay: "✈️❤️💡🏁🏠💪🎄☕️👑⚽🔥🙏🏁☁️👍🎉🎁⚡️🙏❤️🔑🏁🔑✒️🚀🎁☃️☔️🌸💪🌸😀✈️⭐🎵⚡️☔️💪☕️✈️🎁🏁🏁💡🚀🌸😀👍🌸🚀☀️😀",
  fingerprintedName: "Mike✈️❤️💡🏁🏠💪"
}
]

/*
import { displayFingerprint } from "../Fingerprint.ts"
import { primaryKeyToFingerprint } from "../PrimaryKey.ts"
console.log(displayFingerprint(await primaryKeyToFingerprint("VAN1C2B5E9HJQPKJADKCK0SD3G7XEHNFYSXKVPQ9CVS6EW8G1N503")))
console.log(displayFingerprint(await primaryKeyToFingerprint("M1KEU95WVH7KND3TUF7HAH0AFJ2E16BB88M3MY3JS7YT84CMW4K03")))
*/

/*
import { primaryKeyToFingerprint, primaryKeyToFingerprintedName } from "../Name.ts"
console.log(await primaryKeyToFingerprint("VAN1C2B5E9HJQPKJADKCK0SD3G7XEHNFYSXKVPQ9CVS6EW8G1N503"))
console.log(await primaryKeyToFingerprintedName("VAN1C2B5E9HJQPKJADKCK0SD3G7XEHNFYSXKVPQ9CVS6EW8G1N503", "Vanic"))
console.log(await primaryKeyToFingerprint("M1KEU95WVH7KND3TUF7HAH0AFJ2E16BB88M3MY3JS7YT84CMW4K03"))
console.log(await primaryKeyToFingerprintedName("M1KEU95WVH7KND3TUF7HAH0AFJ2E16BB88M3MY3JS7YT84CMW4K03", "Mike"))
*/