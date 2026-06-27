import { publicProcedure, router } from "@back/lib/trpc"
import { chatRouter } from "@back/routers/chat-router"
import { quizGeneratorRouter } from "@back/routers/quiz-generator-router"

export const appRouter = router({
	hello: publicProcedure.query(() => {
		return "Hello, world!"
	}),
	chat: chatRouter,
	quizGenerator: quizGeneratorRouter,
})

export type AppRouter = typeof appRouter
