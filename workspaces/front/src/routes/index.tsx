import { Button } from "@front/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"
import { Code, User } from "lucide-react"

export const Route = createFileRoute("/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-4">
			<h1 className="text-2xl font-bold">Welcome to AI Portfolio</h1>
			<p className="text-balance text-center">
				This project is a collection of mini projects to showcase the
				integration of AI in various applications. <br />
				Each project is designed to demonstrate the capabilities of AI in a fun
				and interactive way.
			</p>
			<div className="flex items-center gap-4">
				<Button>
					<Code />
					GitHub
				</Button>
				<Button>
					<User />
					Portfolio
				</Button>
			</div>
		</div>
	)
}
