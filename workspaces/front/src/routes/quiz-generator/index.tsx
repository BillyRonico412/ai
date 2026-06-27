import { ScrollArea } from "@front/components/ui/scroll-area"
import { quizGeneratorAtoms } from "@front/routes/quiz-generator/-components/atoms"
import { Prompt } from "@front/routes/quiz-generator/-components/Prompt"
import { Quiz } from "@front/routes/quiz-generator/-components/Quiz"
import { Result } from "@front/routes/quiz-generator/-components/Result"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { match } from "ts-pattern"

export const Route = createFileRoute("/_logged/quiz-generator/")({
	component: RouteComponent,
})

function RouteComponent() {
	const step = useAtomValue(quizGeneratorAtoms.stepAtom)

	return (
		<div className="w-dvw h-dvh py-8">
			<div className="h-full w-full flex flex-col gap-8">
				<h1 className="text-xl font-medium text-center">Quiz generator</h1>
				<ScrollArea className="flex-1 w-full overflow-y-auto">
					<div className="container max-w-3xl mx-auto h-full px-4 py-4">
						{match(step)
							.with("prompt", () => <Prompt />)
							.with("quiz", () => <Quiz />)
							.with("result", () => <Result />)
							.exhaustive()}
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}
