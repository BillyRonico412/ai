import { auth } from "@back/lib/auth"
import { env } from "@back/lib/env"
import { appRouter } from "@back/routers/app-router"
import { trpcServer } from "@hono/trpc-server"
import { type Context, Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null
		session: typeof auth.$Infer.Session.session | null
	}
}>()

app.use(
	"*",
	cors({
		allowHeaders: ["Content-Type", "Authorization", "x-lang"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		credentials: true,
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		origin: [env.APP_URL],
	}),
)

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers })
	if (!session) {
		c.set("user", null)
		c.set("session", null)
		await next()
		return
	}
	c.set("user", session.user)
	c.set("session", session.session)
	await next()
})

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw)
})

app.use(
	"/trpc/*",
	trpcServer({
		createContext(
			_,
			c: Context<{
				Variables: {
					user: typeof auth.$Infer.Session.user | null
					session: typeof auth.$Infer.Session.session | null
				}
			}>,
		) {
			const user = c.get("user")
			const session = c.get("session")
			return {
				session,
				user,
			}
		},
		router: appRouter,
		onError({ error, type, path, input, ctx }) {
			console.error(`Error in TRPC procedure ${type} ${path}:`, error)
			console.info("Context:", ctx)
			console.info("Input:", input)
		},
	}),
)

export default {
	port: 4000,
	fetch: app.fetch,
}
