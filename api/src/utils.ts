import crypto from "crypto";

export const randomString = (bytesSize = 32) =>
  crypto.randomBytes(bytesSize).toString("hex");

export const numbersInRangeObject = (begin: number, end: number) => {
  if (begin > end) throw new Error("Begin cannot be less than end")
  let sum = 0;
  let count = 0;

  for (let index = begin; index < end; index++) {
    sum += index;
    count++;
  }
  return { sum, count };
};
