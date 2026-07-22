import { Button } from "@front/components/ui/button"
import { authClient } from "@front/lib/auth"
import { createFileRoute, redirect, useSearch } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { toast } from "sonner"
import { z } from "zod"

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	validateSearch: zodValidator(
		z.object({
			redirectTo: z.string().optional(),
		}),
	),
	beforeLoad: async ({ context }) => {
		if (context.session) {
			toast.error("You are already logged in.")
			throw redirect({
				to: "/",
			})
		}
	},
})

function RouteComponent() {
	const { redirectTo } = useSearch({
		from: "/auth/login",
	})
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8">
			<h1 className="text-2xl font-bold">AI Portfolio</h1>
			<p className="text-center text-balance max-w-lg text-muted-foreground">
				Welcome to my AI portfolio! Please log in with your Google account to
				access the projects and explore the capabilities of AI integrated into
				web applications.
			</p>
			<Button
				onClick={async () => {
					await authClient.signIn.social({
						provider: "google",
						callbackURL: globalThis.location.origin + (redirectTo || ""),
					})
					toast.success("Redirecting to Google login...")
				}}
			>
				Login with Google
			</Button>
		</div>
	)
}
