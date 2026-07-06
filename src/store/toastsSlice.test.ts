import { describe, expect, it } from "vitest";
import reducer, { toastAdded, toastDismissed } from "./toastsSlice";

describe("toastsSlice", () => {
    it("adds a toast with a generated id", () => {
        const next = reducer([], toastAdded("Potion bottled.", "success"));

        expect(next).toHaveLength(1);
        expect(next[0].message).toBe("Potion bottled.");
        expect(next[0].tone).toBe("success");
        expect(next[0].id).toBeTruthy();
    });

    it("removes only the dismissed toast", () => {
        const firstState = reducer([], toastAdded("Potion bottled.", "success"));
        const secondState = reducer(firstState, toastAdded("Potion spilled.", "error"));
        const idToDismiss = firstState[0].id;
        const finalState = reducer(secondState, toastDismissed(idToDismiss));

        expect(finalState).toHaveLength(1);
        expect(finalState[0].id).not.toBe(idToDismiss);
    });
});
