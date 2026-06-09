import { publicProcedure, router } from "@back/lib/trpc"
import { chatRouter } from "@back/routers/chat-router"

export const appRouter = router({
	hello: publicProcedure.query(() => {
		return "Hello, world!"
	}),
	chat: chatRouter,
})

export type AppRouter = typeof appRouter
