"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { auth } from "@/lib/auth";
import { validateReview } from "@/lib/review-validation";

export type ReviewActionState = { status: "idle" } | { status: "error"; message: string } | { status: "success" };

export async function submitReview(packageName: string, _previous: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { status: "error", message: "Sign in to leave a note." };

    const parsed = validateReview(formData.get("rating"), formData.get("body"));
    if (!parsed.ok) return { status: "error", message: parsed.error };

    await db
        .insert(reviews)
        .values({
            userId: session.user.id,
            packageName,
            rating: parsed.rating,
            body: parsed.body
        })
        .onConflictDoUpdate({
            target: [reviews.userId, reviews.packageName],
            set: {
                rating: sql`excluded.rating`,
                body: sql`excluded.body`,
                updatedAt: new Date()
            }
        });

    revalidatePath(`/apps/${packageName}`);
    return { status: "success" };
}

export async function deleteReview(packageName: string): Promise<void> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return;

    await db.delete(reviews).where(and(eq(reviews.userId, session.user.id), eq(reviews.packageName, packageName)));

    revalidatePath(`/apps/${packageName}`);
}
