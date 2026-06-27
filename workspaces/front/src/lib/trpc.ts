import type { AppRouter } from "@back/routers/app-router"
import { env } from "@front/lib/env"
import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import superjson from "superjson"

export const queryClient = new QueryClient()

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		loggerLink(),
		httpBatchLink({
			url: `${env.VITE_SERVER_URL}/trpc`,
			transformer: superjson,
			fetch: (input, init) =>
				fetch(input, {
					...init,
					credentials: "include",
				}),
		}),
	],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
})

export type Inputs = inferRouterInputs<AppRouter>
export type Outputs = inferRouterOutputs<AppRouter>
