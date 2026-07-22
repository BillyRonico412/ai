import { ModeToggle } from "@front/components/mode-toggle"
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@front/components/ui/avatar"
import { Button } from "@front/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@front/components/ui/popover"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@front/components/ui/tooltip"
import { authClient } from "@front/lib/auth"
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router"
import { Code, Globe, LogOut, RefreshCcw } from "lucide-react"

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	async beforeLoad({ context, location }) {
		if (!context.session) {
			throw redirect({
				to: "/auth/login",
				search: {
					redirectTo: location.href,
				},
			})
		}
		return {
			session: context.session,
		}
	},
})

function RouteComponent() {
	return (
		<div className="w-dvw h-dvh flex flex-col overflow-x-hidden">
			<NavBar />
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	)
}

const NavBar = () => (
	<div className="w-full border-b">
		<div className="w-full flex items-center justify-between px-4 py-2 container mx-auto">
			<Link to="/" className="font-bold">
				AI Portfolio
			</Link>
			<div className="flex items-center gap-2">
				<ModeToggle />
				<Tooltip>
					<TooltipTrigger
						render={
							<a
								href="https://github.com/BillyRonico412/ai"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button size="icon">
									<Code />
								</Button>
							</a>
						}
					/>
					<TooltipContent>Github Repository</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger
						render={
							<a
								href="https://www.ronico-billy.fr"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button size="icon">
									<Globe />
								</Button>
							</a>
						}
					/>
					<TooltipContent>Personal Website</TooltipContent>
				</Tooltip>
				<Profile />
			</div>
		</div>
	</div>
)

const Profile = () => {
	const { session } = useRouteContext({
		from: "/_authed",
	})
	const navigate = useNavigate({
		from: "/",
	})
	const router = useRouter()
	return (
		<Popover>
			<PopoverTrigger>
				<Avatar>
					<AvatarImage src={session.user.image ?? undefined} />
					<AvatarFallback>{session.user.name[0] ?? "?"}</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent className="space-y-3" align="end">
				<p className="text-center text-sm text-muted-foreground">
					{session.user.email}
				</p>
				<div className="flex items-center gap-1">
					<p className="text-sm text-muted-foreground">Quota remaining</p>
					<p className="text-sm font-medium text-foreground ml-auto">
						{session.user.quota}
					</p>
				</div>
				<div className="flex gap-1 items-center">
					<Button
						size="sm"
						variant="outline"
						className="flex-1"
						onClick={async () => {
							await router.invalidate()
						}}
					>
						<RefreshCcw className="ml-2 h-4 w-4" />
						Refresh quota
					</Button>
					<Button
						size="sm"
						onClick={() => {
							authClient.signOut()
							navigate({
								to: "/auth/login",
							})
						}}
						className="flex-1"
					>
						<LogOut />
						Logout
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
