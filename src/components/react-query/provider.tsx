"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function ReactQueryProvider(props: { children: ReactNode }) {
    const queryClient = new QueryClient();

    return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
