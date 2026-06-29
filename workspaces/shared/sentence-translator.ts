import z from "zod"

const zodConfig = z.object({
	theme: z.string().min(1, { message: "Theme is required" }),
	nbSentences: z
		.number()
		.min(1, { message: "At least one sentence is required" }),
	level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"], {
		message: "Level is required",
	}),
})

const zodCorrectAnswer = z.object({
	sentence: z.string().min(1, { message: "Sentence is required" }),
	userAnswer: z.string().min(1, { message: "User answer is required" }),
})

export const sentenceTranslatorShared = {
	zodConfig,
	zodCorrectAnswer,
}
