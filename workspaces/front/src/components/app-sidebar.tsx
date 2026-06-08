import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@front/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { BotMessageSquare, Brain, Home } from "lucide-react"

export const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarHeader>
				<h1 className="flex items-center gap-2 text-lg font-semibold justify-center">
					<Brain />
					AI SDK
				</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<Link to="/">
								{({ isActive }) => (
									<SidebarMenuButton isActive={isActive}>
										<Home />
										Home
									</SidebarMenuButton>
								)}
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<Link to="/chat">
								{({ isActive }) => (
									<SidebarMenuButton isActive={isActive}>
										<BotMessageSquare />
										Chat
									</SidebarMenuButton>
								)}
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
