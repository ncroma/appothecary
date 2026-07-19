import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import type { App } from "@/db/queries";
import { Search } from "./search";

function makeApp(name: string): App {
    return {
        packageName: name.toLowerCase().replaceAll(" ", "."),
        name,
        developer: "Test Labs",
        description: null,
        iconUrl: null,
        graphicUrl: null,
        downloads: 1000,
        ratingAvg: 4.2,
        ageRating: null,
        aptoideUrl: null,
        curated: false,
        embedding: null,
        ingestedAt: new Date(0),
        updatedAt: new Date(0)
    };
}

type PendingRequest = { url: string; resolve: (apps: App[]) => void };

let pendingRequests: PendingRequest[];

function renderSearch(providers?: { store: ReturnType<typeof makeStore>; queryClient: QueryClient }) {
    const store = providers?.store ?? makeStore();
    const queryClient = providers?.queryClient ?? new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const view = render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Search />
            </QueryClientProvider>
        </Provider>
    );
    return { store, queryClient, unmount: view.unmount };
}

function typeQuery(value: string) {
    fireEvent.change(screen.getByRole("searchbox"), { target: { value } });
}

async function typeLikeAHuman(value: string) {
    for (let end = 1; end <= value.length; end++) {
        typeQuery(value.slice(0, end));
        await act(() => vi.advanceTimersByTimeAsync(90));
    }
}

async function settleDebounce() {
    await act(() => vi.advanceTimersByTimeAsync(600));
}

async function respond(apps: App[]) {
    const request = pendingRequests.shift();
    if (!request) throw new Error("no pending search request to respond to");
    await act(async () => {
        request.resolve(apps);
        await vi.advanceTimersByTimeAsync(0);
    });
}

describe("Search", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        pendingRequests = [];
        vi.stubGlobal(
            "fetch",
            vi.fn(
                (url: string) =>
                    new Promise((resolveFetch) => {
                        pendingRequests.push({
                            url,
                            resolve: (apps) => resolveFetch({ ok: true, json: async () => apps })
                        });
                    })
            )
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it("steeps through the debounce, then shows results", async () => {
        renderSearch();

        typeQuery("help me sleep");
        expect(screen.queryByText("Steeping…")).not.toBeInTheDocument();

        await settleDebounce();
        expect(screen.getByText("Steeping…")).toBeInTheDocument();

        await respond([makeApp("Calm")]);
        expect(screen.getByText("Calm")).toBeInTheDocument();
        expect(screen.getByText("In stock · 1")).toBeInTheDocument();
    });

    it("keeps previous results dimmed while a refinement steeps", async () => {
        renderSearch();

        typeQuery("meditation");
        await settleDebounce();
        await respond([makeApp("Calm")]);

        typeQuery("meditation app");
        expect(screen.getByText("Calm")).toBeInTheDocument();
        expect(screen.getByRole("list")).toHaveClass("opacity-40");

        await settleDebounce();
        expect(screen.getByText("Calm")).toBeInTheDocument();
        expect(screen.getByRole("list")).toHaveClass("opacity-40");

        await respond([makeApp("Headspace")]);
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();
        expect(screen.getByText("Headspace")).toBeInTheDocument();
        expect(screen.getByRole("list")).not.toHaveClass("opacity-40");
    });

    it("never resurrects results after the search is cleared", async () => {
        renderSearch();

        typeQuery("meditation");
        await settleDebounce();
        await respond([makeApp("Calm")]);

        fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();
        expect(screen.getByRole("searchbox")).toHaveFocus();

        await act(() => vi.advanceTimersByTimeAsync(700));
        await typeLikeAHuman("chess trainer");
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();

        await settleDebounce();
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();
        expect(screen.getByText("Steeping…")).toBeInTheDocument();

        await respond([makeApp("Lichess")]);
        expect(screen.getByText("Lichess")).toBeInTheDocument();
    });

    it("steeps fresh when the same query is retyped after a clear", async () => {
        renderSearch();

        typeQuery("meditation");
        await settleDebounce();
        await respond([makeApp("Calm")]);

        fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
        await act(() => vi.advanceTimersByTimeAsync(61_000));
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();

        await typeLikeAHuman("meditation");
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();
        await settleDebounce();
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();
        expect(screen.getByText("Steeping…")).toBeInTheDocument();

        await respond([makeApp("Headspace")]);
        expect(screen.getByText("Headspace")).toBeInTheDocument();
    });

    it("never resurrects results after backspacing the query away", async () => {
        renderSearch();

        typeQuery("meditation");
        await settleDebounce();
        await respond([makeApp("Calm")]);

        for (const value of ["medita", "medi", "me", ""]) typeQuery(value);
        await act(() => vi.advanceTimersByTimeAsync(700));
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();

        typeQuery("chess trainer");
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();
        await settleDebounce();
        expect(screen.queryByText("Calm")).not.toBeInTheDocument();
    });

    it("restores the search as it was left when coming back from a detail page", async () => {
        const { store, queryClient, unmount } = renderSearch();

        typeQuery("meditation");
        await settleDebounce();
        await respond([makeApp("Calm")]);

        unmount();
        renderSearch({ store, queryClient });

        expect(screen.getByRole("searchbox")).toHaveValue("meditation");
        expect(screen.getByText("Calm")).toBeInTheDocument();
        expect(pendingRequests).toHaveLength(0);
    });

    it("shows the empty message only once the brew settles", async () => {
        renderSearch();

        typeQuery("obscure potion");
        await settleDebounce();
        expect(screen.queryByText("No remedy matches those symptoms.")).not.toBeInTheDocument();

        await respond([]);
        expect(screen.getByText("No remedy matches those symptoms.")).toBeInTheDocument();
    });
});
