import { masks } from "../src/index";
import { test, expect } from "vitest";

test("visa", () => {
  const valid = [
    "4123 4567 8912 3456",
    "4123456789123",
    "4123456789123456",
  ];

  const invalid = [
    "5123 4567 8912 3456", // Starts with 5 (not Visa)
    "4123 4567 8912", // 12 digits
    "4123 4567 8912 345", // 15 digits
    "4123 4567 8912 34567", // 17 digits
  ];

  valid.forEach((number) => {
    expect(masks.visa.final.test(number.replace(/\s+/g, ""))).toBe(true);
  });

  invalid.forEach((number) => {
    expect(masks.visa.final.test(number.replace(/\s+/g, ""))).toBe(false);
  });
});

test("mastercard", () => {
  const valid = [
    "5123 4567 8912 3456",
    "5123456789123456",
  ];

  const invalid = [
    "4123 4567 8912 3456", // Starts with 4 (not MasterCard)
    "5123 4567 8912", // 12 digits
    "5123 4567 8912 34567", // 17 digits
    "5123 4567 8912 345", // 15 digits
  ];

  valid.forEach((number) => {
    expect(masks.mastercard.final.test(number.replace(/\s+/g, ""))).toBe(true);
  });

  invalid.forEach((number) => {
    expect(masks.mastercard.final.test(number.replace(/\s+/g, ""))).toBe(false);
  });
});

test("amex", () => {
  const valid = [
    "3714 4963 5398 431",
    "378282246310005",
  ];

  const invalid = [
    "4123 4567 8912 3456", // Starts with 4 (not Amex)
    "3714 4963 5398", // 12 digits
    "3714 4963 5398 4312", // 16 digits
    "37828224631000", // 14 digits
  ];

  valid.forEach((number) => {
    expect(masks.amex.final.test(number.replace(/\s+/g, ""))).toBe(true);
  });

  invalid.forEach((number) => {
    expect(masks.amex.final.test(number.replace(/\s+/g, ""))).toBe(false);
  });
});

test("discover", () => {
  const valid = [
    "6011 1111 1111 1117",
    "6500 0000 0000 0000",
  ];

  const invalid = [
    "4123 4567 8912 3456", // Starts with 4 (not Discover)
    "6011 1111 1111", // 12 digits
    "6011 1111 1111 11111", // 17 digits
    "6500 0000 0000 000", // 15 digits
  ];

  valid.forEach((number) => {
    expect(masks.discover.final.test(number.replace(/\s+/g, ""))).toBe(true);
  });

  invalid.forEach((number) => {
    expect(masks.discover.final.test(number.replace(/\s+/g, ""))).toBe(false);
  });
});

test("diners", () => {
  const valid = [
    "3000 0000 0000 04",
    "3056 9309 0259 04",
  ];

  const invalid = [
    "4123 4567 8912 3456", // Starts with 4 (not Diners Club)
    "3000 0000 0000", // 12 digits
    "3000 0000 0000 0456", // 16 digits
    "3056 9309 0259 045", // 15 digits
  ];

  valid.forEach((number) => {
    expect(masks.diners.final.test(number.replace(/\s+/g, ""))).toBe(true);
  });

  invalid.forEach((number) => {
    expect(masks.diners.final.test(number.replace(/\s+/g, ""))).toBe(false);
  });
});

test("jcb", () => {
  const valid = [
    "2131 1234 5678 123",
    "3512 3456 7890 1234",
  ];

  const invalid = [
    "4123 4567 8912 3456", // Starts with 4 (not JCB)
    "2131 1234 5678", // 12 digits
    "2131 1234 5678 12345", // 17 digits
    "3512 3456 7890", // 12 digits
  ];

  valid.forEach((number) => {
    expect(masks.jcb.final.test(number.replace(/\s+/g, ""))).toBe(true);
  });

  invalid.forEach((number) => {
    expect(masks.jcb.final.test(number.replace(/\s+/g, ""))).toBe(false);
  });
});
