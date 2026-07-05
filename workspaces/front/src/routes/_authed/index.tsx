import { Projects } from "@front/routes/_authed/-components/projects"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-4">
			<p className="text-center text-balance text-2xl font-bold">
				Welcome to my AI portfolio!
			</p>
			<p className="text-center text-balance">
				This is a collection of small personal projects that showcase my skills
				in development, particularly in integrating AI into web applications.
			</p>
			<div className="mt-8">
				<Projects />
			</div>
		</div>
	)
}
