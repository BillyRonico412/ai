import { Button } from "@front/components/ui/button"
import { ButtonGroup } from "@front/components/ui/button-group"
import { Field, FieldError, FieldLabel } from "@front/components/ui/field"
import type { ConfigForm } from "@front/routes/_authed/sentence-translator/-components/atom"
import type { SentenceTranslatorFormType } from "@front/routes/_authed/sentence-translator/-components/config/config-form"

export const LevelField = (props: { form: SentenceTranslatorFormType }) => {
	const { form } = props
	return (
		<Field>
			<form.Field
				name="level"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid
					return (
						<Field data-invalid={isInvalid}>
							<div className="flex items-center gap-4">
								<FieldLabel htmlFor={field.name}>Level</FieldLabel>
								<ButtonGroup id={field.name}>
									{["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
										<Button
											key={level}
											size="sm"
											variant={
												field.state.value === level ? "default" : "outline"
											}
											onClick={() =>
												field.handleChange(level as ConfigForm["level"])
											}
										>
											{level}
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
