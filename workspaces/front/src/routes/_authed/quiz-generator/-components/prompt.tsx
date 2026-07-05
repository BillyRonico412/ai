import { Field, FieldDescription, FieldLabel } from "@front/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@front/components/ui/input-group"
import { quizGeneratorAtoms } from "@front/routes/_authed/quiz-generator/-components/atoms"
import { useAtom, useAtomValue, useSetAtom } from "jotai"

export const Prompt = () => {
	const [prompt, setPrompt] = useAtom(quizGeneratorAtoms.promptAtom)
	const generateQuiz = useSetAtom(quizGeneratorAtoms.generateQuizAtom)
	const loading = useAtomValue(quizGeneratorAtoms.loadingGenerateQuizAtom)

	return (
		<div className="w-full h-full flex items-center-safe">
			<Field>
				<FieldLabel>Enter a topic for the quiz</FieldLabel>
				<InputGroup className="w-full">
					<InputGroupTextarea
						placeholder="Enter a topic for the quiz..."
						value={prompt}
						onChange={(e) => {
							setPrompt(e.target.value)
						}}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							variant="default"
							size="lg"
							onClick={() => generateQuiz()}
							disabled={loading}
						>
							Generate
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
				<FieldDescription>
					The AI will generate a quiz based on the topic you provide. Please
					enter a topic with precision to get the best results. For example,
					instead of "History", you could enter "World War II" or "Ancient Greek
					God". This will help the AI generate a more focused and relevant quiz.
				</FieldDescription>
			</Field>
		</div>
	)
}
