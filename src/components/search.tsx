"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppCard } from "@/components/app-card";
import type { App } from "@/db/queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const MODES = {
    symptom: {
        label: "By symptom",
        placeholder: "What ails you?",
        minLength: 5,
        debounce: 600,
        endpoint: "/api/search/semantic",
        empty: "No remedy matches those symptoms."
    },
    name: {
        label: "By name",
        placeholder: "Search the shelves…",
        minLength: 2,
        debounce: 300,
        endpoint: "/api/search",
        empty: "Nothing on the shelves by that name."
    }
} as const;

type SearchMode = keyof typeof MODES;

export function Search() {
    const [mode, setMode] = useState<SearchMode>("symptom");
    const [query, setQuery] = useState("");
    const [lastCleared, setLastCleared] = useState("");
    const config = MODES[mode];
    const trimmedQuery = query.trim();
    const debouncedQuery = useDebouncedValue(trimmedQuery, config.debounce);
    const enabled = debouncedQuery.length >= config.minLength && trimmedQuery.length >= config.minLength;

    const {
        data: results,
        isFetching,
        isError
    } = useQuery({
        queryKey: ["search", mode, debouncedQuery],
        queryFn: async (): Promise<App[]> => {
            const res = await fetch(`${config.endpoint}?q=${encodeURIComponent(debouncedQuery)}`);
            if (!res.ok) throw new Error(`Search failed with ${res.status}`);
            return res.json();
        },
        enabled,
        staleTime: 60_000,
        placeholderData: (previousData, previousQuery) => (previousQuery?.queryKey[1] === mode && previousQuery.queryKey[2] !== lastCleared ? previousData : undefined)
    });

    const stale = isFetching || trimmedQuery !== debouncedQuery;
    const resultsWereCleared = debouncedQuery === lastCleared;
    const stillTyping = trimmedQuery !== debouncedQuery;
    const hideResults = resultsWereCleared && stillTyping;

    const handleQueryInputChange = (nextQuery: string) => {
        if (nextQuery === query) return;
        if (nextQuery.trim().length < config.minLength) {
            setLastCleared(debouncedQuery);
        }
        setQuery(nextQuery);
    };

    return (
        <section className="flex flex-col gap-3 min-h-52">
            <div className="flex gap-2">
                {(Object.keys(MODES) as SearchMode[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        aria-pressed={mode === key}
                        onClick={() => setMode(key)}
                        className={`cursor-pointer rounded-sm px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                            mode === key ? "bg-elixir text-bottle" : "bg-foam/10 text-foam/70 hover:bg-foam/20"
                        }`}
                    >
                        {MODES[key].label}
                    </button>
                ))}
            </div>

            <div className="relative">
                <input
                    type="search"
                    value={query}
                    onChange={(event) => handleQueryInputChange(event.target.value)}
                    placeholder={config.placeholder}
                    className="w-full rounded-sm surface-vial px-4 py-3 pr-10 placeholder:opacity-50 outline-none focus-visible:ring-1 focus-visible:ring-elixir/60 [&::-webkit-search-cancel-button]:hidden"
                />
                {query.length > 0 && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => handleQueryInputChange("")}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-sm text-foam/60 transition-colors hover:text-foam"
                    >
                        ✕
                    </button>
                )}
            </div>

            {enabled && (
                <div aria-live="polite" className="flex flex-col gap-3">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">{stale ? "Steeping…" : `In stock · ${results?.length ?? 0}`}</p>

                    {results && results.length > 0 && !hideResults && (
                        <ul className={`grid grid-cols-1 gap-3 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 ${stale ? "opacity-40" : ""}`}>
                            {results.map((app) => (
                                <li key={app.packageName}>
                                    <AppCard app={app} />
                                </li>
                            ))}
                        </ul>
                    )}

                    {results?.length === 0 && !stale && <p className="max-w-prose text-sm opacity-70">{config.empty}</p>}

                    {isError && <p className="text-sm text-oxblood">The dispensary caught fire — try again later.</p>}
                </div>
            )}
        </section>
    );
}
