"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppCard } from "@/components/app-card";
import type { App } from "@/db/queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { modePicked, queryTyped, searchCleared, type SearchMode } from "@/store/searchSlice";

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

export function Search() {
    const dispatch = useAppDispatch();
    const { mode, query, session } = useAppSelector((state) => state.search);
    const inputRef = useRef<HTMLInputElement>(null);
    const config = MODES[mode];
    const trimmedQuery = query.trim();
    const debouncedQuery = useDebouncedValue(trimmedQuery, config.debounce);
    const stillTyping = trimmedQuery !== debouncedQuery;
    const enabled = !stillTyping && trimmedQuery.length >= config.minLength;
    const showPanel = debouncedQuery.length >= config.minLength && trimmedQuery.length >= config.minLength;

    const {
        data: results,
        isFetching,
        isError
    } = useQuery({
        queryKey: ["search", mode, session, debouncedQuery],
        queryFn: async (): Promise<App[]> => {
            const res = await fetch(`${config.endpoint}?q=${encodeURIComponent(debouncedQuery)}`);
            if (!res.ok) throw new Error(`Search failed with ${res.status}`);
            return res.json();
        },
        enabled,
        staleTime: 120_000,
        placeholderData: (previousData, previousQuery) => (previousQuery?.queryKey[1] === mode && previousQuery.queryKey[2] === session ? previousData : undefined)
    });

    const stale = isFetching || stillTyping;

    const handleQueryInputChange = (nextQuery: string) => {
        if (nextQuery === query) return;
        if (nextQuery.trim().length < config.minLength && trimmedQuery.length >= config.minLength) {
            dispatch(searchCleared());
        }
        dispatch(queryTyped(nextQuery));
    };

    return (
        <section className="flex flex-col gap-3 min-h-52">
            <div className="flex gap-2">
                {(Object.keys(MODES) as SearchMode[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        aria-pressed={mode === key}
                        onClick={() => dispatch(modePicked(key))}
                        className={`cursor-pointer rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-elixir/60 sm:py-1 ${
                            mode === key ? "bg-elixir text-bottle" : "bg-foam/10 text-foam/70 hover:bg-foam/20"
                        }`}
                    >
                        {MODES[key].label}
                    </button>
                ))}
            </div>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(event) => handleQueryInputChange(event.target.value)}
                    placeholder={config.placeholder}
                    className="w-full rounded-sm surface-vial px-4 py-4 pr-12 placeholder:opacity-50 outline-none focus-visible:ring-1 focus-visible:ring-elixir/60 sm:py-3 sm:pr-10 [&::-webkit-search-cancel-button]:hidden"
                />
                {query.length > 0 && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                            handleQueryInputChange("");
                            inputRef.current?.focus();
                        }}
                        className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer p-3 text-base text-foam/60 transition-colors hover:text-foam sm:p-2 sm:text-sm"
                    >
                        ✕
                    </button>
                )}
            </div>

            {showPanel && (
                <div aria-live="polite" className="flex flex-col gap-3">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">{stale ? "Steeping…" : `In stock · ${results?.length ?? 0}`}</p>

                    {results && results.length > 0 && (
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
