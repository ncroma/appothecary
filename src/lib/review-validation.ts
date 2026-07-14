export type ReviewValidation = { ok: true; rating: number; body: string | null } | { ok: false; error: string };

const BODY_MAX = 2000;

export function validateReview(rating: unknown, body: unknown): ReviewValidation {
    const parsed = Number(rating);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
        return { ok: false, error: "Pick a rating between 1 and 5 drops." };
    }

    const text = typeof body === "string" ? body.trim() : "";

    if (text.length > BODY_MAX) {
        return { ok: false, error: `Keep the note under ${BODY_MAX} characters.` };
    }

    return { ok: true, rating: parsed, body: text.length > 0 ? text : null };
}
