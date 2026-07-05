import { quotaProcedure, router } from "@back/lib/trpc"
import { increaseQuota } from "@back/lib/utils"
import { generateText, Output } from "ai"
import z from "zod"

const zodQuizGeneratorQuiz = z.object({
	title: z.string().min(1, "Title is required"),
	questions: z
		.array(
			z.object({
				question: z.string().min(1, "Question is required"),
				options: z
					.array(z.string().min(1, "Option is required"))
					.length(4, "Exactly 4 options are required"),
				indexOfCorrectOption: z
					.number()
					.min(0)
					.max(3, "Index of correct option must be between 0 and 3"),
			}),
		)
		.length(5, "Exactly 5 questions are required"),
})

const quizGeneratorSystemPrompt = `
You are a quiz generator.
You will be given a topic and you will generate a quiz based on that topic.
The quiz should be in English or French.
The difficulty of the quiz should be appropriate for a high school student.
The difficulty increases with each question.
`

export const quizGeneratorRouter = router({
	generateQuiz: quotaProcedure
		.input(
			z.object({
				prompt: z
					.string()
					.min(1, "Prompt is required")
					.max(100, "Prompt must be less than 100 characters"),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const data = await generateText({
				model: "anthropic/claude-haiku-4.5",
				system: quizGeneratorSystemPrompt,
				output: Output.object({
					schema: zodQuizGeneratorQuiz,
				}),
				prompt: `Generate a quiz based on the following topic: "${input.prompt}"`,
			})
			await increaseQuota(ctx.user.id)
			return data.output
		}),
})
