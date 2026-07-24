import { Button } from "@front/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@front/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@front/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@front/components/ui/input-group"
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "@front/components/ui/progress"
import { sentenceTranslatorAtoms } from "@front/routes/_authed/sentence-translator/-components/atom"
import { useForm } from "@tanstack/react-form"
import { useSelector } from "@tanstack/react-store"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
	ArrowRight,
	BotMessageSquare,
	Copy,
	Eye,
	Info,
	RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import z from "zod"

const useSessionForm = () => {
	const checkAnswer = useSetAtom(sentenceTranslatorAtoms.checkAnswerAtom)
	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: zodSession,
		},
		onSubmit: async ({ value }) => {
			await checkAnswer(value.userAnswer)
		},
	})
	return form
}

type SessionForm = ReturnType<typeof useSessionForm>
type SessionInput = z.infer<typeof zodSession>

export const Translate = () => {
	const form = useSessionForm()
	return (
		<div className="w-full h-full flex flex-col gap-8">
			<ProgressBar />
			<Session form={form} />
			<Correction form={form} />
		</div>
	)
}

const ProgressBar = () => {
	const sentences = useAtomValue(sentenceTranslatorAtoms.sentencesAtom)
	const indexSentence = useAtomValue(sentenceTranslatorAtoms.indexSentenceAtom)
	const progress = (indexSentence / sentences.length) * 100
	return (
		<Progress value={progress} className="w-full">
			<ProgressLabel>Session progress</ProgressLabel>
			<ProgressValue />
		</Progress>
	)
}

const zodSession = z.object({
	userAnswer: z.string(),
})

const defaultValues: SessionInput = {
	userAnswer: "",
}

const Session = (props: { form: SessionForm }) => {
	const { form } = props
	const currentSentence = useAtomValue(
		sentenceTranslatorAtoms.currentSentenceAtom,
	)
	const [hintVisible, setIsHintVisible] = useAtom(
		sentenceTranslatorAtoms.hintVisibleAtom,
	)
	const correction = useAtomValue(sentenceTranslatorAtoms.correctionAtom)
	return (
		<Card>
			<CardHeader>
				<CardTitle>{currentSentence.sentence}</CardTitle>
			</CardHeader>
			<CardContent>
				<form.Field
					name="userAnswer"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid
						return (
							<Field>
								<FieldLabel>Translation</FieldLabel>
								<InputGroup>
									<InputGroupTextarea
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault()
												form.handleSubmit()
											}
										}}
										aria-invalid={isInvalid}
										autoComplete="off"
										placeholder="Type your translation here..."
									/>
									<form.Subscribe
										selector={(state) => state.isSubmitting}
										children={(isSubmitting) => (
											<InputGroupAddon align="block-end">
												<InputGroupButton
													className="ml-auto"
													type="button"
													variant="outline"
													disabled={!!correction || isSubmitting}
													onClick={() => {
														form.setFieldValue("userAnswer", "")
														form.handleSubmit()
													}}
												>
													<Eye />
													Reveal answer
												</InputGroupButton>
												<InputGroupButton
													variant="outline"
													onClick={() => setIsHintVisible((prev) => !prev)}
													disabled={!!correction || isSubmitting}
												>
													<Info />
													Hint
												</InputGroupButton>
												<InputGroupButton
													type="button"
													variant="default"
													onClick={() => form.handleSubmit()}
													disabled={!!correction || isSubmitting}
												>
													<BotMessageSquare />
													Check answer
												</InputGroupButton>
											</InputGroupAddon>
										)}
									/>
								</InputGroup>
								{hintVisible && (
									<FieldDescription className="text-sm text-muted-foreground mt-2">
										Hint: {currentSentence.hint}
									</FieldDescription>
								)}
							</Field>
						)
					}}
				/>
			</CardContent>
		</Card>
	)
}

const Correction = (props: { form: SessionForm }) => {
	const { form } = props
	const correction = useAtomValue(sentenceTranslatorAtoms.correctionAtom)
	const currentSentence = useAtomValue(
		sentenceTranslatorAtoms.currentSentenceAtom,
	)
	const sentences = useAtomValue(sentenceTranslatorAtoms.sentencesAtom)
	const indexSentence = useAtomValue(sentenceTranslatorAtoms.indexSentenceAtom)
	const nextSentence = useSetAtom(sentenceTranslatorAtoms.nextSentenceAtom)
	const reset = useSetAtom(sentenceTranslatorAtoms.resetAtom)
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
				<div className="flex flex-col gap-1.5">
					<span className="text-sm font-medium">Optimal translation</span>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{optimalTranslation}
					</p>
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
