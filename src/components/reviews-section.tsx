"use client";

import Image from "next/image";
import { useActionState, useOptimistic, useTransition } from "react";
import { useEffect, useRef, useState } from "react";
import { deleteReview, submitReview, type ReviewActionState } from "@/app/apps/[packageName]/actions";
import { authClient } from "@/lib/auth-client";
import { useAppDispatch } from "@/store/hooks";
import { toastAdded } from "@/store/toastsSlice";
import type { ReviewWithAuthor } from "@/db/queries";

type OptimisticReview = ReviewWithAuthor & { pending?: boolean };

const RATINGS = [1, 2, 3, 4, 5] as const;
type Rating = (typeof RATINGS)[number];

const RATING_STYLES: Record<Rating, { level: string; liquid: string; rise: string; note: string }> = {
    1: { level: "translate-y-[90%]", liquid: "bg-linear-to-b from-oxblood/90 to-oxblood/60", rise: "-2px", note: "One drop — left a bitter taste." },
    2: { level: "translate-y-[70%]", liquid: "bg-linear-to-b from-oxblood/80 to-elixir/50", rise: "-8px", note: "Two drops — weak brew." },
    3: { level: "translate-y-[55%]", liquid: "bg-linear-to-b from-elixir/90 to-oxblood/70", rise: "-13px", note: "Three drops — a decent tonic." },
    4: { level: "translate-y-[40%]", liquid: "bg-linear-to-b from-elixir/90 to-elixir/60", rise: "-18px", note: "Four drops — potent stuff." },
    5: { level: "translate-y-[25%]", liquid: "bg-linear-to-b from-elixir to-elixir/80", rise: "-23px", note: "Five drops — pure elixir." }
};

function RatingStars({ rating }: { rating: number }) {
    return (
        <div aria-label={`${rating} of 5`} className="flex gap-0.5 text-xs">
            {RATINGS.map((n) => (
                <span key={n} aria-hidden className={n <= rating ? "text-elixir" : "text-foam/25"}>
                    ★
                </span>
            ))}
        </div>
    );
}

export function ReviewsSection({ packageName, reviews }: { packageName: string; reviews: ReviewWithAuthor[] }) {
    const { data: session, isPending: isSessionPending } = authClient.useSession();
    const dispatch = useAppDispatch();
    const formRef = useRef<HTMLFormElement>(null);
    const [isDeleting, startDelete] = useTransition();

    const [optimisticReviews, addOptimistic] = useOptimistic<OptimisticReview[], OptimisticReview>(reviews, (current, incoming) => [
        incoming,
        ...current.filter((review) => review.userId !== incoming.userId)
    ]);

    const [state, formAction, isPending] = useActionState(
        async (previous: ReviewActionState, formData: FormData): Promise<ReviewActionState> => {
            if (session) {
                addOptimistic({
                    id: "optimistic",
                    rating: Number(formData.get("rating")),
                    body: String(formData.get("body") ?? "").trim() || null,
                    createdAt: new Date(),
                    userId: session.user.id,
                    authorName: session.user.name,
                    authorImage: session.user.image ?? null,
                    pending: true
                });
            }
            return submitReview(packageName, previous, formData);
        },
        { status: "idle" }
    );

    useEffect(() => {
        if (state.status === "success") dispatch(toastAdded("Review bottled.", "success"));
        if (state.status === "error") dispatch(toastAdded(state.message, "error"));
    }, [state, dispatch]);

    const ownReview = session ? reviews.find((review) => review.userId === session.user.id) : undefined;

    const [pickedRating, setPickedRating] = useState<Rating | null>(null);
    const rating = pickedRating ?? (ownReview ? (ownReview.rating as Rating) : null);

    return (
        <section className="flex flex-col gap-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-herb">Visitor notes · {optimisticReviews.length}</h2>

            {isSessionPending ? (
                <div aria-hidden className="h-48 animate-pulse rounded-sm bg-foam/8" />
            ) : session ? (
                <form ref={formRef} action={formAction} className="flex flex-col gap-3 rounded-sm surface-vial p-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <fieldset className="flex items-center gap-2">
                            <legend className="sr-only">Your rating</legend>
                            {RATINGS.map((n) => (
                                <label
                                    key={n}
                                    className={`relative h-9 w-6 cursor-pointer overflow-hidden rounded-t-md rounded-b-[10px] border transition-colors has-focus-visible:ring-1 has-focus-visible:ring-elixir/60 ${
                                        rating === n ? "border-foam/30 bg-bottle/70" : "border-foam/15 bg-foam/5 hover:bg-foam/15"
                                    }`}
                                >
                                    <input type="radio" name="rating" value={n} required checked={rating === n} onChange={() => setPickedRating(n)} aria-label={`${n} of 5`} className="sr-only" />
                                    {rating === n ? (
                                        <>
                                            <span aria-hidden className={`absolute inset-0 animate-pour motion-reduce:animate-none ${RATING_STYLES[n].level}`}>
                                                <span className={`absolute -top-0.75 -left-4 size-14 animate-settle rounded-[46%] motion-reduce:animate-none ${RATING_STYLES[n].liquid}`} />
                                            </span>
                                            <span
                                                aria-hidden
                                                className="absolute bottom-1 left-[35%] size-0.75 animate-bubble rounded-full bg-foam/90 motion-reduce:animate-none"
                                                style={
                                                    {
                                                        "--bubble-rise": RATING_STYLES[n].rise,
                                                        transformOrigin: "center",
                                                        animationDelay: "0.5s",
                                                        animationFillMode: "backwards"
                                                    } as React.CSSProperties
                                                }
                                            />
                                            <span
                                                aria-hidden
                                                className="absolute bottom-0.5 left-[60%] size-0.5 animate-bubble rounded-full bg-foam/90 motion-reduce:animate-none"
                                                style={
                                                    {
                                                        "--bubble-rise": RATING_STYLES[n].rise,
                                                        transformOrigin: "center",
                                                        animationDelay: "1.6s",
                                                        animationDuration: "3.4s",
                                                        animationFillMode: "backwards"
                                                    } as React.CSSProperties
                                                }
                                            />
                                        </>
                                    ) : (
                                        <span aria-hidden className={`absolute inset-0 ${RATING_STYLES[n].level}`}>
                                            <span className="absolute -top-0.75 -left-4 size-14 rounded-[46%] bg-foam/15" />
                                        </span>
                                    )}
                                </label>
                            ))}
                        </fieldset>
                        <p aria-live="polite" className="font-mono text-xs text-herb">
                            {rating ? RATING_STYLES[rating].note : "Rate this remedy — one to five drops."}
                        </p>
                    </div>
                    <textarea
                        name="body"
                        rows={3}
                        maxLength={2000}
                        defaultValue={ownReview?.body ?? ""}
                        placeholder="What did this remedy fix for you?"
                        className="w-full resize-y rounded-sm bg-bottle/60 px-3 py-2 text-sm placeholder:opacity-50 outline-none focus-visible:ring-1 focus-visible:ring-elixir/60"
                    />
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer self-start rounded-sm bg-elixir px-4 py-1.5 text-sm font-semibold text-bottle transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {isPending ? "Bottling…" : ownReview ? "Update note" : "Bottle review"}
                        </button>
                        {ownReview && (
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() =>
                                    startDelete(async () => {
                                        await deleteReview(packageName);
                                        setPickedRating(null);
                                        dispatch(toastAdded("Note removed from the ledger.", "success"));
                                    })
                                }
                                className="cursor-pointer text-sm text-oxblood/90 hover:underline disabled:opacity-50"
                            >
                                {isDeleting ? "Removing…" : "Remove my note"}
                            </button>
                        )}
                        {state.status === "error" && <p className="text-sm text-oxblood">{state.message}</p>}
                    </div>
                </form>
            ) : (
                <p className="rounded-sm surface-vial p-4 text-sm opacity-80">Sign in (top right) to leave a note for the next visitor.</p>
            )}

            {optimisticReviews.length > 0 ? (
                <ul className="flex flex-col gap-3">
                    {optimisticReviews.map((review) => (
                        <li key={review.id} className={`flex flex-col gap-2 rounded-sm surface-vial p-4 ${review.pending ? "opacity-60" : ""}`}>
                            <div className="flex items-center gap-3">
                                {review.authorImage ? (
                                    <Image src={review.authorImage} alt="" width={24} height={24} className="rounded-full bg-vial" />
                                ) : (
                                    <div aria-hidden className="grid size-6 place-items-center rounded-full bg-bottle text-xs text-herb">
                                        {review.authorName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-sm font-medium">{review.authorName}</span>
                                <RatingStars rating={review.rating} />
                                <span className="ml-auto font-mono text-xs opacity-50">{new Date(review.createdAt).toISOString().slice(0, 10)}</span>
                            </div>
                            {review.body && <p className="max-w-prose text-sm leading-relaxed whitespace-pre-line opacity-85">{review.body}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm opacity-60">No notes on this remedy yet — the ledger is open.</p>
            )}
        </section>
    );
}
