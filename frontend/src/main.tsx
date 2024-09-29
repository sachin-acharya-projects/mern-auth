import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient } from "@tanstack/react-query"
import { Toaster } from "sonner"

import App from "@/App.tsx"
import "@/styles/tailwind.css"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Toaster
                closeButton
                position="top-center"
                className="toast"
                richColors
            />
            <App />
            <ReactQueryDevtools position="bottom" initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
)
