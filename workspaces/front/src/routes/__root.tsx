import { TooltipProvider } from "@front/components/ui/tooltip"
import { authClient } from "@front/lib/auth"
import { queryClient } from "@front/lib/trpc"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
	async beforeLoad() {
		const sessionRes = await authClient.getSession()
		return {
			session: sessionRes.data,
		}
	},
	component: RootLayout,
})

function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Outlet />
			</TooltipProvider>
		</QueryClientProvider>
	)
}
