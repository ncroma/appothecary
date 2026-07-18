import { describe, expect, it } from "vitest";
import { canonicalAptoideUrl, mapAppMeta, type AptoideMeta } from "./aptoide";

describe("canonicalAptoideUrl", () => {
    it("strips store params and forces the app path", () => {
        expect(canonicalAptoideUrl("https://smart-switch.en.aptoide.com/?store_name=mods-mods-ofisial&app_id=62946177")).toBe(
            "https://smart-switch.en.aptoide.com/app"
        );
    });

    it("leaves an already canonical url unchanged", () => {
        expect(canonicalAptoideUrl("https://bigo-live.en.aptoide.com/app")).toBe("https://bigo-live.en.aptoide.com/app");
    });

    it("leaves non-aptoide hosts unchanged", () => {
        expect(canonicalAptoideUrl("https://example.com/whatever?x=1")).toBe("https://example.com/whatever?x=1");
    });

    it("leaves unparseable values unchanged", () => {
        expect(canonicalAptoideUrl("not a url")).toBe("not a url");
    });
});

describe("mapAppMeta", () => {
    it("handles happy path", () => {
        const json: AptoideMeta = {
            info: { status: "OK" },
            data: {
                name: "Test App",
                package: "com.test.app",
                icon: "icon_url",
                graphic: "graphic_url",
                added: "2024-01-01",
                age: { title: "Everyone" },
                developer: { name: "Test Developer" },
                media: { description: "Test Description" },
                urls: { w: "https://test-app.en.aptoide.com/?store_name=some-store&app_id=123" },
                stats: {
                    downloads: 1000,
                    rating: { avg: 4.5, total: 100 },
                    prating: { avg: 4.9, total: 100 }
                }
            }
        };

        const result = mapAppMeta(json);
        expect(result).toEqual({
            packageName: "com.test.app",
            name: "Test App",
            developer: "Test Developer",
            description: "Test Description",
            iconUrl: "icon_url",
            graphicUrl: "graphic_url",
            downloads: 1000,
            ratingAvg: 4.9,
            ageRating: "Everyone",
            aptoideUrl: "https://test-app.en.aptoide.com/app"
        });
    });

    it("handles no prating but has rating", () => {
        const json: AptoideMeta = {
            info: { status: "OK" },
            data: {
                name: "Test App",
                package: "com.test.app",
                stats: {
                    downloads: 1000,
                    rating: { avg: 4, total: 100 }
                }
            }
        };

        const result = mapAppMeta(json);
        expect(result).toEqual({
            packageName: "com.test.app",
            name: "Test App",
            developer: null,
            description: null,
            iconUrl: null,
            graphicUrl: null,
            downloads: 1000,
            ratingAvg: 4,
            ageRating: null,
            aptoideUrl: null
        });
    });

    it("handles missing optional fields", () => {
        const json: AptoideMeta = {
            info: { status: "OK" },
            data: {
                name: "Test App",
                package: "com.test.app"
            }
        };
        const result = mapAppMeta(json);
        expect(result).toEqual({
            packageName: "com.test.app",
            name: "Test App",
            developer: null,
            description: null,
            iconUrl: null,
            graphicUrl: null,
            downloads: null,
            ratingAvg: null,
            ageRating: null,
            aptoideUrl: null
        });
    });

    it("returns null for non-OK status", () => {
        const json: AptoideMeta = {
            info: { status: "ERROR" },
            data: {
                name: "Test App",
                package: "com.test.app"
            }
        };
        const result = mapAppMeta(json);
        expect(result).toBeNull();
    });

    it("returns null for missing package or name", () => {
        const json1: AptoideMeta = {
            info: { status: "OK" },
            data: {
                name: "Test App"
            }
        };
        const json2: AptoideMeta = {
            info: { status: "OK" },
            data: {
                package: "com.test.app"
            }
        };
        expect(mapAppMeta(json1)).toBeNull();
        expect(mapAppMeta(json2)).toBeNull();
    });
});
