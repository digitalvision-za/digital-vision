import { describe, expect, it } from "vitest";
import { formatStartingPrice } from "../../src/lib/format";

describe("formatStartingPrice", () => {
  it("uses an honest scope prompt when no price has been approved", () => {
    expect(formatStartingPrice(null, "ZAR", "Starting from")).toBe("Let us scope it together");
  });

  it("formats South African Rand guidance without cents", () => {
    expect(formatStartingPrice(25000, "ZAR", "Starting from")).toContain("25");
    expect(formatStartingPrice(25000, "ZAR", "Starting from")).toMatch(/^Starting from/);
  });
});