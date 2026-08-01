import { Button } from "@front/components/ui/button"
import { Card, CardContent } from "@front/components/ui/card"
import { FieldGroup, FieldSet } from "@front/components/ui/field"
import { Spinner } from "@front/components/ui/spinner"
import { useConfigForm } from "@front/routes/_authed/sentence-translator/-components/config/config-form"
import { LessonField } from "@front/routes/_authed/sentence-translator/-components/config/lesson-field"
import { LevelField } from "@front/routes/_authed/sentence-translator/-components/config/level-field"
import { NumberSentencesField } from "@front/routes/_authed/sentence-translator/-components/config/number-sentences-field"
import { ThemeField } from "@front/routes/_authed/sentence-translator/-components/config/theme-field"

export const Config = () => {
	const form = useConfigForm()
	return (
		<div className="w-full h-full flex items-center-safe">
			<Card className="w-full">
				<CardContent>
					<FieldSet>
						<FieldGroup>
							<ThemeField form={form} />
							<LessonField form={form} />
							<NumberSentencesField form={form} />
							<LevelField form={form} />
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
