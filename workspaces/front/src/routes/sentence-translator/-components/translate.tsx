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
	InputGroupInput,
} from "@front/components/ui/input-group"
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "@front/components/ui/progress"
import { sentenceTranslatorAtoms } from "@front/routes/sentence-translator/-components/atom"
import { useForm } from "@tanstack/react-form"
import { useSelector } from "@tanstack/react-store"
import { useAtomValue, useSetAtom } from "jotai"
import { ArrowRight, BotMessageSquare, Eye, Info } from "lucide-react"
import { useState } from "react"
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
	userAnswer: z.string().min(1, { message: "User answer is required" }),
})

const defaultValues: SessionInput = {
	userAnswer: "",
}

const Session = (props: { form: SessionForm }) => {
	const { form } = props
	const currentSentence = useAtomValue(
		sentenceTranslatorAtoms.currentSentenceAtom,
	)
	const [isHintVisible, setIsHintVisible] = useState(false)
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
									<InputGroupInput
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
								{isHintVisible && (
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
	const sentences = useAtomValue(sentenceTranslatorAtoms.sentencesAtom)
	const indexSentence = useAtomValue(sentenceTranslatorAtoms.indexSentenceAtom)
	const nextSentence = useSetAtom(sentenceTranslatorAtoms.nextSentenceAtom)
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
	const { score, weaknesses, corrections, optimalTranslation } = correction
	const isLastSentence = indexSentence >= sentences.length - 1
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
					<span className="text-sm font-medium">Weaknesses</span>
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
			</CardContent>
			<CardFooter className="justify-end">
				<Button
					type="button"
					onClick={() => {
						nextSentence()
						form.reset()
					}}
				>
					{isLastSentence ? "See results" : "Next"}
					<ArrowRight />
				</Button>
			</CardFooter>
		</Card>
	)
}
