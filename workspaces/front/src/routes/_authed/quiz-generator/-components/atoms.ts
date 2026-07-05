import { type Outputs, trpcClient } from "@front/lib/trpc"
import { atom } from "jotai"
import { focusAtom } from "jotai-optics"
import { toast } from "sonner"

export type QuizGeneratorStepType = "prompt" | "quiz" | "result"
export type QuizGeneratorQuizType = Outputs["quizGenerator"]["generateQuiz"]
export type QuizGeneratorQuestionType =
	QuizGeneratorQuizType["questions"][number]

const stepAtom = atom<QuizGeneratorStepType>("prompt")
const promptAtom = atom("")
const quizAtom = atom<QuizGeneratorQuizType | null>(null)
const responseIndicesAtom = atom<number[]>([-1, -1, -1, -1, -1])
const loadingGenerateQuizAtom = atom(false)

const generateQuizAtom = atom(null, async (get, set) => {
	try {
		set(loadingGenerateQuizAtom, true)
		const prompt = get(promptAtom)
		const quiz = await trpcClient.quizGenerator.generateQuiz.mutate({
			prompt,
		})
		set(quizAtom, quiz)
		set(stepAtom, "quiz")
	} catch (error) {
		console.error("Error generating quiz:", error)
		toast.error("Failed to generate quiz. Please try again.")
	}
	finally {
		set(loadingGenerateQuizAtom, false)
	}
})

const getResponseIndicesAtom = (index: number) =>
	focusAtom(responseIndicesAtom, (optic) => optic.prop(index))

const submitQuizAtom = atom(null, async (_, set) => {
	set(stepAtom, "result")
})

const resetQuizAtom = atom(null, (_, set) => {
	set(stepAtom, "prompt")
	set(promptAtom, "")
	set(quizAtom, null)
	set(responseIndicesAtom, [])
})

const resultAtom = atom((get) => {
	const step = get(stepAtom)
	if (step !== "result") {
		return null
	}
	const quiz = get(quizAtom)
	if (!quiz) {
		return null
	}
	const responseIndices = get(responseIndicesAtom)
	let correctCount = 0
	for (const [index, question] of quiz.questions.entries()) {
		if (responseIndices[index] === question.indexOfCorrectOption) {
			correctCount++
		}
	}
	return correctCount
})

export const quizGeneratorAtoms = {
	stepAtom,
	promptAtom,
	quizAtom,
	responseIndicesAtom,
	generateQuizAtom,
	loadingGenerateQuizAtom,
	getResponseIndicesAtom,
	submitQuizAtom,
	resetQuizAtom,
	resultAtom,
}
