import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@front/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@front/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@front/components/ui/input-group"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemTitle,
} from "@front/components/ui/item"
import type { SentenceTranslatorFormType } from "@front/routes/_authed/sentence-translator/-components/config/config-form"
import lessons from "@front/routes/_authed/sentence-translator/-components/lessons.json"
import { ChevronDown, ChevronRightIcon } from "lucide-react"
import { useState } from "react"

export const LessonField = (props: { form: SentenceTranslatorFormType }) => {
	const { form } = props
	const [open, setOpen] = useState(false)
	return (
		<Field>
			<form.Field
				name="lesson"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid
					return (
						<Field data-invalid={isInvalid}>
							<FieldLabel htmlFor={field.name}>Lesson (optional)</FieldLabel>
							<InputGroup>
								<InputGroupInput
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Present continuous"
									autoComplete="off"
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										type="button"
										size="icon-xs"
										variant="outline"
										onClick={() => setOpen(true)}
									>
										<ChevronDown />
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					)
				}}
			/>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-xl h-full">
					<DialogHeader>
						<DialogTitle>Select a lesson</DialogTitle>
					</DialogHeader>
					<form.Subscribe selector={(state) => state.values.level}>
						{(level) => (
							<div className="flex flex-col gap-2 overflow-y-auto">
								{lessons
									.filter((lesson) => lesson.level === level)
									.map((lesson) => (
										<Item
											variant="outline"
											size="sm"
											key={lesson.id}
											className="cursor-pointer hover:bg-accent"
											onClick={() => {
												form.setFieldValue("lesson", lesson.title)
												setOpen(false)
											}}
										>
											<ItemContent>
												<ItemTitle>{lesson.title}</ItemTitle>
											</ItemContent>
											<ItemActions>
												<ChevronRightIcon className="size-4" />
											</ItemActions>
										</Item>
									))}
							</div>
						)}
					</form.Subscribe>
				</DialogContent>
			</Dialog>
		</Field>
	)
}
