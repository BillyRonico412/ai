import { Button } from "@front/components/ui/button"
import { ButtonGroup } from "@front/components/ui/button-group"
import { Field, FieldError, FieldLabel } from "@front/components/ui/field"
import type { SentenceTranslatorFormType } from "@front/routes/_authed/sentence-translator/-components/config/config-form"

export const NumberSentencesField = (props: {
	form: SentenceTranslatorFormType
}) => {
	const { form } = props
	return (
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
												field.state.value === num ? "default" : "outline"
											}
											onClick={() => field.handleChange(num)}
										>
											{num}
										</Button>
									))}
								</ButtonGroup>
							</div>

							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					)
				}}
			/>
		</Field>
	)
}
