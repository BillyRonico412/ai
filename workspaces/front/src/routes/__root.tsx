import { AppSidebar } from "@front/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@front/components/ui/sidebar"
import { TooltipProvider } from "@front/components/ui/tooltip"
import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({ component: RootLayout })

function RootLayout() {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />
				<main className="w-full h-dvh flex flex-col gap-4 relative px-4 py-8">
					<div className="absolute top-0 left-0">
						<SidebarTrigger />
					</div>
					<Outlet />
				</main>
			</SidebarProvider>
		</TooltipProvider>
	)
}
