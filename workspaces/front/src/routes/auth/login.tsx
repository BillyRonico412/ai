import { Button } from "@front/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<Button>Login with Google</Button>
		</div>
	)
}
