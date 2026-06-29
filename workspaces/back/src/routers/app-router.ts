import { router } from "@back/lib/trpc"
import { chatRouter } from "@back/routers/chat-router"
import { quizGeneratorRouter } from "@back/routers/quiz-generator-router"
import { sentenceTranslatorRouter } from "@back/routers/sentence-translator-router"

export const appRouter = router({
	chat: chatRouter,
	quizGenerator: quizGeneratorRouter,
	sentenceTranslator: sentenceTranslatorRouter,
})

export type AppRouter = typeof appRouter
