import { TooltipProvider } from "@front/components/ui/tooltip"
import { queryClient } from "@front/lib/trpc"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({ component: RootLayout })

function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<main className="w-full h-dvh">
					<Outlet />
				</main>
			</TooltipProvider>
		</QueryClientProvider>
	)
}
