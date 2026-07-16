import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { toastAdded } from "@/store/toastsSlice";
import { Toaster } from "./toaster";

// Real store per test; dispatches from outside React are act()-wrapped.
function renderToaster() {
    const store = makeStore();
    render(
        <Provider store={store}>
            <Toaster />
        </Provider>
    );
    return store;
}

describe("Toaster", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders a dispatched toast", () => {
        const store = renderToaster();

        act(() => {
            store.dispatch(toastAdded("Review bottled.", "success"));
        });

        expect(screen.getByText("Review bottled.")).toBeInTheDocument();
    });

    it("auto-dismisses after its lifetime", () => {
        const store = renderToaster();

        act(() => {
            store.dispatch(toastAdded("Review bottled.", "success"));
        });
        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(screen.queryByText("Review bottled.")).not.toBeInTheDocument();
    });

    it("dismisses on the close button", () => {
        // fireEvent, not userEvent — userEvent's internal waits hang under
        // fake timers
        const store = renderToaster();

        act(() => {
            store.dispatch(toastAdded("Note removed.", "success"));
        });
        fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

        expect(screen.queryByText("Note removed.")).not.toBeInTheDocument();
    });
});
