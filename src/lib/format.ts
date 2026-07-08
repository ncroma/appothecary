export function formatDownloads(downloads: number | null): string {
    return downloads != null && downloads >= 0 ? Intl.NumberFormat("en", { notation: "compact" }).format(downloads) : "-";
}
