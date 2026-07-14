import { describe, expect, it } from "vitest";
import { validateReview } from "./review-validation";

describe("validateReview", () => {
    it("accepts a valid rating with a trimmed body", () => {
        expect(validateReview("4", "  Lovely tonic.  ")).toEqual({
            ok: true,
            rating: 4,
            body: "Lovely tonic."
        });
    });

    it("turns an empty body into null", () => {
        expect(validateReview("5", "   ")).toEqual({ ok: true, rating: 5, body: null });
        expect(validateReview("5", null)).toEqual({ ok: true, rating: 5, body: null });
    });

    it("rejects out-of-range and non-integer ratings", () => {
        expect(validateReview("0", null).ok).toBe(false);
        expect(validateReview("6", null).ok).toBe(false);
        expect(validateReview("4.5", null).ok).toBe(false);
        expect(validateReview("potion", null).ok).toBe(false);
        expect(validateReview(null, null).ok).toBe(false);
    });

    it("rejects a body over the length cap", () => {
        const result = validateReview("3", "a".repeat(2001));
        expect(result.ok).toBe(false);
    });
});
