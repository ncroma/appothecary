"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AppCard } from "@/components/app-card";
import type { App } from "@/db/queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function Search() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query.trim(), 300);
    const enabled = debouncedQuery.length >= 2;

    const {
        data: results,
        isFetching,
        isError
    } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: async (): Promise<App[]> => {
            const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
            if (!res.ok) throw new Error(`Search failed with ${res.status}`);
            return res.json();
        },
        enabled,
        placeholderData: keepPreviousData
    });

    return (
        <section className="flex flex-col gap-4">
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the shelves…"
                className="w-full rounded-sm bg-vial px-4 py-3 placeholder:opacity-50 outline-none focus-visible:ring-1 focus-visible:ring-elixir/60"
            />

            {enabled && (
                <div aria-live="polite" className="flex flex-col gap-3">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">{isFetching ? "Steeping…" : `Results · ${results?.length ?? 0}`}</p>

                    {results && results.length > 0 && (
                        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {results.map((app) => (
                                <li key={app.packageName}>
                                    <AppCard app={app} />
                                </li>
                            ))}
                        </ul>
                    )}

                    {results?.length === 0 && !isFetching && (
                        <p className="max-w-prose text-sm opacity-70">
                            Nothing on the shelves by that name. Check the spelling — or try the maker&apos;s name; the labels list those too.
                        </p>
                    )}

                    {isError && <p className="text-sm text-oxblood">The cauldron hiccuped — try that search again.</p>}
                </div>
            )}
        </section>
    );
}
