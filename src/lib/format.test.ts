import { describe, expect, it } from "vitest";
import { formatDownloads } from "./format";

describe("formatDownloads", () => {
    it("formats positive numbers correctly", () => {
        expect(formatDownloads(1000)).toBe("1K");
        expect(formatDownloads(2000000)).toBe("2M");
    });

    it("returns 0 for number 0", () => {
        expect(formatDownloads(0)).toBe("0");
    });

    it("returns '-' for null or non-positive numbers", () => {
        expect(formatDownloads(null)).toBe("-");
        expect(formatDownloads(-100)).toBe("-");
    });
});
