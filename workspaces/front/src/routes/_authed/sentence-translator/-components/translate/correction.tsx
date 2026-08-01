import { Button } from '@front/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@front/components/ui/card"
import { speek } from "@front/lib/speech"
import { sentenceTranslator } from "@front/routes/_authed/sentence-translator/-components/atom"
import type { SessionForm } from '@front/routes/_authed/sentence-translator/-components/translate/session-form'
import { useSelector } from "@tanstack/react-store"
import { useAtomValue, useSetAtom } from "jotai"
import { ArrowRight, Copy, RotateCcw, Volume2 } from "lucide-react"
import { toast } from "sonner"

export const Correction = (props: { form: SessionForm }) => {
	const { form } = props
	const correction = useAtomValue(sentenceTranslator.correctionAtom)
	const currentSentence = useAtomValue(sentenceTranslator.currentSentenceAtom)
	const sentences = useAtomValue(sentenceTranslator.sentencesAtom)
	const indexSentence = useAtomValue(sentenceTranslator.indexSentenceAtom)
	const nextSentence = useSetAtom(sentenceTranslator.nextSentenceAtom)
	const reset = useSetAtom(sentenceTranslator.resetAtom)
	const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)
	if (isSubmitting) {
		return (
			<Card className="shimmer">
				<CardContent className="flex items-center justify-center">
					<span className="text-sm text-muted-foreground">
						Checking your answer...
					</span>
				</CardContent>
			</Card>
		)
	}
	if (!correction) {
		return null
	}
	const {
		score,
		strengths,
		weaknesses,
		corrections,
		keyPointsToImprove,
		optimalTranslation,
	} = correction
	const isLastSentence = indexSentence >= sentences.length - 1
	const copyLearningPrompt = async () => {
		const prompt = buildLearningPrompt({
			sentence: currentSentence.sentence,
			userAnswer: form.state.values.userAnswer,
			optimalTranslation,
			keyPointsToImprove,
		})
		try {
			await navigator.clipboard.writeText(prompt)
			toast.success("Prompt copié ! Collez-le dans ChatGPT ou Gemini.")
		} catch (error) {
			console.error("Error copying prompt:", error)
			toast.error("Impossible de copier le prompt.")
		}
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>Correction</CardTitle>
				<CardAction>
					<span className="text-lg font-bold">{score}/100</span>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<div className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
						Points positifs
					</span>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{strengths}
					</p>
				</div>
				<div className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-destructive">
						Points à améliorer
					</span>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{weaknesses}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex flex-col gap-1.5">
						<span className="text-sm font-medium">Optimal translation</span>
						<p className="text-sm leading-relaxed text-muted-foreground">
							{optimalTranslation}
						</p>
					</div>
					<Button
						size="xs"
						variant="outline"
						className="ml-auto"
						onClick={() => {
							speek({ text: optimalTranslation })
						}}
					>
						<Volume2 />
					</Button>
				</div>
				{corrections.length > 0 && (
					<div className="flex flex-col gap-3">
						<span className="text-sm font-medium">Corrections</span>
						{corrections.map((item) => (
							<div
								key={`${item.error}-${item.correction}`}
								className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4"
							>
								<p className="text-sm">
									<span className="text-muted-foreground line-through">
										{item.error}
									</span>{" "}
									&rarr; <span className="font-medium">{item.correction}</span>
								</p>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{item.explanation}
								</p>
							</div>
						))}
					</div>
				)}
				{keyPointsToImprove.length > 0 && (
					<div className="flex flex-col gap-3">
						<span className="text-sm font-medium">Notions à réviser</span>
						<div className="flex flex-wrap gap-2">
							{keyPointsToImprove.map((item) => (
								<span
									key={`${item.category}-${item.notion}`}
									className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs"
								>
									<span className="font-medium">{item.notion}</span>
									<span className="text-muted-foreground">
										({item.category})
									</span>
								</span>
							))}
						</div>
						<Button
							type="button"
							variant="outline"
							className="self-start"
							onClick={copyLearningPrompt}
						>
							<Copy />
							Copier le prompt pour approfondir
						</Button>
					</div>
				)}
			</CardContent>
			<CardFooter className="justify-end">
				<Button
					type="button"
					onClick={() => {
						if (isLastSentence) {
							reset()
						} else {
							nextSentence()
						}
						form.reset()
					}}
				>
					{isLastSentence ? "Reset" : "Next"}
					{isLastSentence ? <RotateCcw /> : <ArrowRight />}
				</Button>
			</CardFooter>
		</Card>
	)
}

const buildLearningPrompt = (params: {
	sentence: string
	userAnswer: string
	optimalTranslation: string
	keyPointsToImprove: { notion: string; category: string }[]
}) => {
	const { sentence, userAnswer, optimalTranslation, keyPointsToImprove } =
		params
	const notionsList = keyPointsToImprove
		.map((item) => `- ${item.notion} (${item.category})`)
		.join("\n")
	return (
		"Je suis en train d'apprendre l'anglais et j'ai besoin de ton aide pour m'améliorer.\n" +
		"\n" +
		"Voici l'exercice que je viens de faire :\n" +
		`- Phrase en français : "${sentence}"\n` +
		`- Ma traduction : "${userAnswer}"\n` +
		`- Traduction optimale : "${optimalTranslation}"\n` +
		"\n" +
		"Voici les notions de langue anglaise que je dois améliorer :\n" +
		`${notionsList}\n` +
		"\n" +
		"Pour chacune de ces notions, peux-tu :\n" +
		"1. M'expliquer la règle de manière claire et concise.\n" +
		"2. Me montrer 2 ou 3 exemples concrets (avec traduction française).\n" +
		"3. Me donner une astuce simple pour ne plus faire l'erreur.\n" +
		"\n" +
		"Réponds en français."
	)
}
