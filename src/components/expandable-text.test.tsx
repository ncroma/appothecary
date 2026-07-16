import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpandableText } from "./expandable-text";

describe("ExpandableText", () => {
    it("starts clamped and expands on click", async () => {
        const user = userEvent.setup();
        render(<ExpandableText text="A very long label." className="text-sm" />);

        const paragraph = screen.getByText("A very long label.");
        expect(paragraph.className).toContain("line-clamp-6");

        await user.click(screen.getByRole("button", { name: "Show more" }));

        expect(paragraph.className).not.toContain("line-clamp-6");
        expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
    });

    it("collapses again on the second click", async () => {
        const user = userEvent.setup();
        render(<ExpandableText text="A very long label." className="text-sm" />);

        await user.click(screen.getByRole("button", { name: "Show more" }));
        await user.click(screen.getByRole("button", { name: "Show less" }));

        expect(screen.getByText("A very long label.").className).toContain("line-clamp-6");
        expect(screen.getByRole("button", { name: "Show more" })).toBeInTheDocument();
    });
});
