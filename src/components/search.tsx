"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AppCard } from "@/components/app-card";
import { VialLoader } from "@/components/vial-loader";
import type { App } from "@/db/queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const MODES = {
    name: {
        label: "By name",
        placeholder: "Search the shelves…",
        minLength: 2,
        debounce: 300,
        endpoint: "/api/search",
        empty: "Nothing on the shelves by that name. Check the spelling — or try the maker's name; the labels list those too."
    },
    ailment: {
        label: "By ailment",
        placeholder: "Describe your ailment…",
        minLength: 5,
        debounce: 600,
        endpoint: "/api/search/semantic",
        empty: "No remedy matches that ailment — try describing what troubles you differently."
    }
} as const;

type SearchMode = keyof typeof MODES;

export function Search() {
    const [mode, setMode] = useState<SearchMode>("name");
    const [query, setQuery] = useState("");
    const config = MODES[mode];
    const debouncedQuery = useDebouncedValue(query.trim(), config.debounce);
    const enabled = debouncedQuery.length >= config.minLength;

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
        placeholderData: keepPreviousData
    });

    const steeping = mode === "ailment" && isFetching && !results;

    return (
        <section className="flex flex-col gap-3">
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

            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={config.placeholder}
                className="w-full rounded-sm surface-vial px-4 py-3 placeholder:opacity-50 outline-none focus-visible:ring-1 focus-visible:ring-elixir/60"
            />

            {enabled && (
                <div aria-live="polite" className="flex flex-col gap-3">
                    {steeping ? (
                        <div className="py-4">
                            <VialLoader />
                        </div>
                    ) : (
                        <>
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">
                                {isFetching ? "Steeping…" : `Results · ${results?.length ?? 0}`}
                            </p>

                            {results && results.length > 0 && (
                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {results.map((app) => (
                                        <li key={app.packageName}>
                                            <AppCard app={app} />
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {results?.length === 0 && !isFetching && <p className="max-w-prose text-sm opacity-70">{config.empty}</p>}

                            {isError && <p className="text-sm text-oxblood">The cauldron hiccuped — try that search again.</p>}
                        </>
                    )}
                </div>
            )}
        </section>
    );
}
