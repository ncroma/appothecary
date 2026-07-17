import { describe, expect, it } from "vitest";
import { buildEmbeddingInput } from "./embeddings";

describe("buildEmbeddingInput", () => {
    it("joins name, developer, and description with newlines", () => {
        expect(buildEmbeddingInput({ name: "Signal", developer: "Open Whisper Systems", description: "Private messaging." })).toBe(
            "Signal\nOpen Whisper Systems\nPrivate messaging."
        );
    });

    it("skips missing fields", () => {
        expect(buildEmbeddingInput({ name: "Signal", developer: null, description: null })).toBe("Signal");
    });

    it("clips oversized input", () => {
        const result = buildEmbeddingInput({ name: "A", developer: null, description: "x".repeat(3000) });
        expect(result.length).toBe(1500);
    });
});
