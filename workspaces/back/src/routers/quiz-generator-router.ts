import { publicProcedure, router } from "@back/lib/trpc"
import { generateText, Output } from "ai"
import z from "zod"

const quizGeneratorQuizZod = z.object({
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

export const quizGeneratorRouter = router({
	generateQuiz: publicProcedure
		.input(
			z.object({
				prompt: z
					.string()
					.min(1, "Prompt is required")
					.max(100, "Prompt must be less than 100 characters"),
			}),
		)
		.mutation(async ({ input }) => {
			const data = await generateText({
				model: "openai/gpt-4o-mini",
				system:
					`You are a quiz generator.` +
					`You will be given a topic and you will generate a quiz based on that topic.` +
					`The quiz should be in English or French` +
					`The difficulty of the quiz should be appropriate for a high school student.` +
					`The difficulty increases with each question.`,
				output: Output.object({
					schema: quizGeneratorQuizZod,
				}),
				prompt: `Generate a quiz based on the following topic: "${input.prompt}"`,
			})
			return data.output
		}),
})
