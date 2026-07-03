"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { makeStore } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [store] = useState(() => makeStore());

    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ReduxProvider>
    );
}
