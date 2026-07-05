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
} from "@front/routes/_authed/quiz-generator/-components/atoms"
import { useAtomValue, useSetAtom } from "jotai"

export const Result = () => {
	const quiz = useAtomValue(quizGeneratorAtoms.quizAtom)
	const correctCount = useAtomValue(quizGeneratorAtoms.resultAtom)
	const responseIndices = useAtomValue(quizGeneratorAtoms.responseIndicesAtom)
	const resetQuiz = useSetAtom(quizGeneratorAtoms.resetQuizAtom)

	if (!quiz || correctCount === null) {
		return null
	}

	const totalQuestions = quiz.questions.length
	const percentage = Math.round((correctCount / totalQuestions) * 100)

	const getPerformanceMessage = () => {
		if (percentage === 100) return "Perfect score! Excellent work! 🎉"
		if (percentage >= 80)
			return "Great job! You really know this topic well! 👏"
		if (percentage >= 60) return "Good effort! Keep learning! 📚"
		if (percentage >= 40)
			return "Not bad! Review the material and try again. 💪"
		return "Keep practicing! You'll improve! 🚀"
	}

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader className="text-center space-y-4">
					<CardTitle className="text-3xl">Quiz Complete!</CardTitle>
					<div className="space-y-2">
						<div className="text-5xl font-bold text-primary">{percentage}%</div>
						<CardDescription className="text-lg">
							{correctCount} out of {totalQuestions} correct
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-center text-base font-medium">
						{getPerformanceMessage()}
					</div>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Answer Summary</h2>
				{quiz.questions.map((question, index) => (
					<AnswerSummary
						key={index}
						question={question}
						index={index}
						userAnswerIndex={responseIndices[index]}
					/>
				))}
			</div>

			<Button
				variant="outline"
				size="lg"
				className="w-full sm:flex-1"
				onClick={() => resetQuiz()}
			>
				Take Another Quiz
			</Button>
		</div>
	)
}

const AnswerSummary = (props: {
	question: QuizGeneratorQuestionType
	index: number
	userAnswerIndex?: number
}) => {
	const isCorrect =
		props.userAnswerIndex === props.question.indexOfCorrectOption

	return (
		<Card
			className={cn(
				"border",
				isCorrect ? "border-green-500/25" : "border-red-500/25",
			)}
		>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardDescription className="text-base text-foreground font-medium">
							Question {props.index + 1}: {props.question.question}
						</CardDescription>
					</div>
					<div className="text-2xl flex-shrink-0">
						{isCorrect ? "✅" : "❌"}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div>
					<p className="text-sm font-medium text-muted-foreground mb-2">
						Your answer:
					</p>
					<p
						className={cn(
							"text-sm font-medium",
							isCorrect ? "text-green-600" : "text-red-600",
						)}
					>
						{props.question.options[props.userAnswerIndex ?? -1] ||
							"Not answered"}
					</p>
				</div>
				{!isCorrect && (
					<div>
						<p className="text-sm font-medium text-muted-foreground mb-2">
							Correct answer:
						</p>
						<p className="text-sm font-medium text-green-700">
							{props.question.options[props.question.indexOfCorrectOption]}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
