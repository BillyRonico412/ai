import { ModeToggle } from "@front/components/mode-toggle"
import { Button } from "@front/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@front/components/ui/tooltip"
import { Projects } from "@front/routes/-components/projects"
import { createFileRoute } from "@tanstack/react-router"
import { Code, User } from "lucide-react"

export const Route = createFileRoute("/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full">
			<NavBar />
			<div className="container mx-auto px-4 py-4">
				<p className="text-center text-balance text-2xl font-bold">
					Welcome to my AI portfolio!
				</p>
				<p className="text-center text-balance">
					This is a collection of small personal projects that showcase my
					skills in development, particularly in integrating AI into web
					applications.
				</p>
				<div className="mt-8">
					<Projects />
				</div>
			</div>
		</div>
	)
}

const NavBar = () => {
	return (
		<div className="w-full border-b">
			<div className="w-full flex items-center justify-between px-4 py-2 container mx-auto">
				<p>AI Portfolio</p>
				<div className="flex items-center gap-2">
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
						></TooltipTrigger>
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
										<User />
									</Button>
								</a>
							}
						></TooltipTrigger>
						<TooltipContent>Personal Website</TooltipContent>
					</Tooltip>
					<ModeToggle />
				</div>
			</div>
		</div>
	)
}
