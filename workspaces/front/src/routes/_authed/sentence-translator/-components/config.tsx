import { Button } from "@front/components/ui/button"
import { ButtonGroup } from "@front/components/ui/button-group"
import { Card, CardContent } from "@front/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@front/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@front/components/ui/input-group"
import { Spinner } from "@front/components/ui/spinner"
import {
	type ConfigForm,
	sentenceTranslatorAtoms,
} from "@front/routes/_authed/sentence-translator/-components/atom"
import { useForm } from "@tanstack/react-form"
import { useAtomValue, useSetAtom } from "jotai"
import { Dices } from "lucide-react"
import { sentenceTranslatorShared } from "shared/sentence-translator"

const defaultValues: ConfigForm = {
	theme: "",
	nbSentences: 3,
	level: "A1",
}

export const Config = () => {
	const generateSentences = useSetAtom(
		sentenceTranslatorAtoms.generateSentencesAtom,
	)
	const generateRandomTopic = useSetAtom(
		sentenceTranslatorAtoms.generateRandomTopicAtom,
	)
	const generateRandomTopicLoading = useAtomValue(
		sentenceTranslatorAtoms.generateRandomTopicLoadingAtom,
	)
	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: sentenceTranslatorShared.zodConfig,
		},
		async onSubmit({ value }) {
			await generateSentences(value)
		},
	})
	return (
		<div className="w-full h-full flex items-center-safe">
			<Card className="w-full">
				<CardContent>
					<FieldSet>
						<FieldGroup>
							<Field>
								<form.Field
									name="theme"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Sentence theme
												</FieldLabel>
												<InputGroup>
													<InputGroupInput
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														placeholder="Simple discussion about a cat"
														autoComplete="off"
													/>
													<InputGroupAddon align="inline-end">
														<InputGroupButton
															type="button"
															size="icon-xs"
															variant="outline"
															disabled={generateRandomTopicLoading}
															aria-label="Generate a random topic"
															onClick={async () => {
																const topic = await generateRandomTopic()
																if (topic) {
																	field.handleChange(topic)
																}
															}}
														>
															{generateRandomTopicLoading ? (
																<Spinner />
															) : (
																<Dices />
															)}
														</InputGroupButton>
													</InputGroupAddon>
												</InputGroup>
												<FieldDescription>
													The theme for a sentence to be translated. For
													example, "Simple discussion about a cat".
												</FieldDescription>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										)
									}}
								/>
							</Field>
							<Field>
								<form.Field
									name="nbSentences"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<div className="flex items-center gap-4">
													<FieldLabel htmlFor={field.name}>
														Number of sentences
													</FieldLabel>
													<ButtonGroup id={field.name}>
														{[3, 5, 10].map((num) => (
															<Button
																key={num}
																size="sm"
																variant={
																	field.state.value === num
																		? "default"
																		: "outline"
																}
																onClick={() => field.handleChange(num)}
															>
																{num}
															</Button>
														))}
													</ButtonGroup>
												</div>
												<FieldDescription>
													The number of sentences to be translated. You can
													choose between 3, 5 or 10 sentences.
												</FieldDescription>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										)
									}}
								/>
							</Field>
							<Field>
								<form.Field
									name="level"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<div className="flex items-center gap-4">
													<FieldLabel htmlFor={field.name}>
														Number of sentences
													</FieldLabel>
													<ButtonGroup id={field.name}>
														{["A1", "A2", "B1", "B2", "C1", "C2"].map(
															(level) => (
																<Button
																	key={level}
																	size="sm"
																	variant={
																		field.state.value === level
																			? "default"
																			: "outline"
																	}
																	onClick={() =>
																		field.handleChange(
																			level as ConfigForm["level"],
																		)
																	}
																>
																	{level}
																</Button>
															),
														)}
													</ButtonGroup>
												</div>
												<FieldDescription>
													The level of the sentence to be translated. A1 is the
													easiest and C2 is the hardest.
												</FieldDescription>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										)
									}}
								/>
							</Field>
							<form.Subscribe
								selector={(state) => state.isSubmitting}
								children={(isSubmitting) => (
									<Button type="submit" onClick={form.handleSubmit}>
										{isSubmitting ? <Spinner /> : "Generate sentences"}
									</Button>
								)}
							/>
						</FieldGroup>
					</FieldSet>
				</CardContent>
			</Card>
		</div>
	)
}
