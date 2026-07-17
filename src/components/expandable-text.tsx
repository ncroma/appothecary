"use client";

import { useState } from "react";

export function ExpandableText({ text, className }: { text: string; className: string }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="flex flex-col items-start gap-2">
            <p className={`${className} ${expanded ? "" : "line-clamp-6"}`}>{text}</p>
            <button type="button" onClick={() => setExpanded((current) => !current)} className="cursor-pointer font-mono text-xs uppercase tracking-[0.15em] text-herb hover:underline">
                {expanded ? "Show less" : "Show more"}
            </button>
        </div>
    );
}
