import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_logged")({
	component: RouteComponent,
	beforeLoad({ context }) {
		if (!context.session) {
			throw redirect({
				to: "/auth/login",
			})
		}
	},
})

function RouteComponent() {
	return <div>Hello "/_logged"!</div>
}
