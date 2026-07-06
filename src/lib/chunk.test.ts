import { describe, expect, it } from "vitest";
import { chunk } from "./chunk";

describe("chunk", () => {
    it("splits with a clean multiple", () => {
        const chunkResult = chunk([1, 2, 3, 4], 2);
        expect(chunkResult).toEqual([
            [1, 2],
            [3, 4]
        ]);
        expect(chunkResult).toHaveLength(2);
    });
    it("splits with a short tail", () => {
        const chunkResult = chunk([1, 2, 3, 4, 5], 2);
        expect(chunkResult).toEqual([[1, 2], [3, 4], [5]]);
        expect(chunkResult).toHaveLength(3);
    });
    it("splits with chunk larger than array", () => {
        const chunkResult = chunk([1, 2, 3], 4);
        expect(chunkResult).toEqual([[1, 2, 3]]);
        expect(chunkResult).toHaveLength(1);
    });
    it("splits with an empty array", () => {
        const chunkResult = chunk([], 2);
        expect(chunkResult).toEqual([]);
        expect(chunkResult).toHaveLength(0);
    });
});
