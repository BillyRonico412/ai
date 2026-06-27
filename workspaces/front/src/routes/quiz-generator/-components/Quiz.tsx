import { Button } from "@front/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@front/components/ui/card"
import { cn } from "@front/lib/utils"
import {
	type QuizGeneratorQuestionType,
	quizGeneratorAtoms,
} from "@front/routes/quiz-generator/-components/atoms"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useMemo } from "react"

export const Quiz = () => {
	const quiz = useAtomValue(quizGeneratorAtoms.quizAtom)
	const submitQuiz = useSetAtom(quizGeneratorAtoms.submitQuizAtom)

	if (!quiz) {
		return null
	}
	return (
		<div className="space-y-8">
			<Card>
				<CardContent>
					<CardTitle className="text-center">{quiz.title}</CardTitle>
				</CardContent>
			</Card>
			<div className="flex flex-col gap-6">
				{quiz.questions.map((question, index) => (
					<Question key={index} question={question} index={index} />
				))}
			</div>
			<Button size="lg" className="w-full" onClick={() => submitQuiz()}>
				Submit
			</Button>
		</div>
	)
}

const Question = (props: {
	question: QuizGeneratorQuestionType
	index: number
}) => {
	const responseIndexAtom = useMemo(
		() => quizGeneratorAtoms.getResponseIndicesAtom(props.index),
		[props.index],
	)
	const [responseIndex, setResponseIndex] = useAtom(responseIndexAtom)
	return (
		<Card>
			<CardHeader>
				<CardDescription className="text-base text-center text-balance">
					Question {props.index + 1}: {props.question.question}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					{props.question.options.map((option, index) => (
						<div
							className={cn(
								"rounded-lg px-4 py-2 flex justify-center-safe items-center-safe transition-colors cursor-pointer text-center text-balance",
								responseIndex === index
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
							)}
							key={index}
							onClick={() => {
								setResponseIndex(index)
							}}
						>
							{option}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
