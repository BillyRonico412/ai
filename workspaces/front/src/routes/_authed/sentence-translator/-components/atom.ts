import { type Outputs, trpcClient } from "@front/lib/trpc"
import { atom } from "jotai"
import type { sentenceTranslatorShared } from "shared/sentence-translator"
import { toast } from "sonner"
import type z from "zod"

export type ConfigForm = z.infer<typeof sentenceTranslatorShared.zodConfig>
export type StepType = "config" | "translate"
export type SentenceItem =
	Outputs["sentenceTranslator"]["generateSenetences"][number]
export type CorrectionAnswer = Outputs["sentenceTranslator"]["correctAnswer"]

const phaseAtom = atom<StepType>("config")
const sentencesAtom = atom<SentenceItem[]>([])
const indexSentenceAtom = atom(0)
const hintVisibleAtom = atom(false)

const currentSentenceAtom = atom((get) => {
	const sentences = get(sentencesAtom)
	const index = get(indexSentenceAtom)
	return sentences[index]
})

const correctionAtom = atom<CorrectionAnswer | undefined>(undefined)

const generateSentencesAtom = atom(
	null,
	async (_, set, configForm: ConfigForm) => {
		try {
			const sentences =
				await trpcClient.sentenceTranslator.generateSenetences.query(configForm)
			set(sentencesAtom, sentences)
			set(indexSentenceAtom, 0)
			set(phaseAtom, "translate")
		} catch (error) {
			console.error("Error generating sentences:", error)
			toast.error(
				"An error occurred while generating sentences. Please try again.",
			)
		}
	},
)

const checkAnswerAtom = atom(null, async (get, set, userAnswer: string) => {
	try {
		const currentSentence = get(currentSentenceAtom)
		const correction = await trpcClient.sentenceTranslator.correctAnswer.query({
			sentence: currentSentence.sentence,
			userAnswer,
		})
		set(correctionAtom, correction)
	} catch (error) {
		console.error("Error checking answer:", error)
		toast.error(
			"An error occurred while checking the answer. Please try again.",
		)
	}
})

const nextSentenceAtom = atom(null, (get, set) => {
	const index = get(indexSentenceAtom)
	const sentences = get(sentencesAtom)
	if (index < sentences.length - 1) {
		set(indexSentenceAtom, index + 1)
		set(correctionAtom, undefined)
		set(hintVisibleAtom, false)
	}
})

const resetAtom = atom(null, (_, set) => {
	set(phaseAtom, "config")
	set(sentencesAtom, [])
	set(indexSentenceAtom, 0)
	set(correctionAtom, undefined)
})

const generateRandomTopicLoadingAtom = atom(false)

const generateRandomTopicAtom = atom(null, async (_, set) => {
	try {
		set(generateRandomTopicLoadingAtom, true)
		const topic =
			await trpcClient.sentenceTranslator.generateRandomTopic.query()
		return topic
	} catch (error) {
		console.error("Error generating random topic:", error)
		toast.error(
			"An error occurred while generating a random topic. Please try again.",
		)
	} finally {
		set(generateRandomTopicLoadingAtom, false)
	}
})

export const sentenceTranslatorAtoms = {
	phaseAtom,
	generateSentencesAtom,
	sentencesAtom,
	indexSentenceAtom,
	currentSentenceAtom,
	correctionAtom,
	checkAnswerAtom,
	nextSentenceAtom,
	resetAtom,
	generateRandomTopicAtom,
	generateRandomTopicLoadingAtom,
	hintVisibleAtom,
}
