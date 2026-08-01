import {
	Card,
	CardContent,
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
import { sentenceTranslator } from "@front/routes/_authed/sentence-translator/-components/atom"
import type { SessionForm } from "@front/routes/_authed/sentence-translator/-components/translate/session-form"
import { useAtom, useAtomValue } from "jotai"
import { BotMessageSquare, Eye, Info, X } from "lucide-react"

export const Session = (props: { form: SessionForm }) => {
	const { form } = props
	const currentSentence = useAtomValue(sentenceTranslator.currentSentenceAtom)
	const [hintVisible, setIsHintVisible] = useAtom(
		sentenceTranslator.hintVisibleAtom,
	)
	const correction = useAtomValue(sentenceTranslator.correctionAtom)
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
													<X />
													Stop
												</InputGroupButton>
												<InputGroupButton
													type="button"
													variant="outline"
													disabled={!!correction || isSubmitting}
													onClick={() => {
														form.setFieldValue("userAnswer", "")
														form.handleSubmit()
													}}
												>
													<Eye />
													Reveal
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
