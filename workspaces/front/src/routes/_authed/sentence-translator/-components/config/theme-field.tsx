import { Field, FieldError, FieldLabel } from "@front/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@front/components/ui/input-group"
import { sentenceTranslator } from "@front/routes/_authed/sentence-translator/-components/atom"
import type { SentenceTranslatorFormType } from "@front/routes/_authed/sentence-translator/-components/config/config-form"
import { Dices } from "lucide-react"

export const ThemeField = (props: { form: SentenceTranslatorFormType }) => {
	const { form } = props
	return (
		<Field>
			<form.Field
				name="theme"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid
					return (
						<Field data-invalid={isInvalid}>
							<FieldLabel htmlFor={field.name}>Sentence theme</FieldLabel>
							<InputGroup>
								<InputGroupInput
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Préparer un petit-déjeuner"
									autoComplete="off"
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										type="button"
										size="icon-xs"
										variant="outline"
										aria-label="Generate a random topic"
										onClick={async () => {
											const topic = sentenceTranslator.generateRandomTheme()
											if (topic) {
												field.handleChange(topic)
											}
										}}
									>
										<Dices />
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					)
				}}
			/>
		</Field>
	)
}
