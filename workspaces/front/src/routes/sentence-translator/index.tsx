import { sentenceTranslatorAtoms } from "@front/routes/sentence-translator/-components/atom"
import { Config } from "@front/routes/sentence-translator/-components/config"
import { Translate } from "@front/routes/sentence-translator/-components/translate"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { match } from "ts-pattern"

export const Route = createFileRoute("/sentence-translator/")({
	component: RouteComponent,
})

function RouteComponent() {
	const step = useAtomValue(sentenceTranslatorAtoms.phaseAtom)
	return (
		<div className="py-8">
			<div className="h-full w-full flex flex-col gap-8">
				<h1 className="text-2xl font-bold text-center">Sentence translator</h1>
				<div className="container max-w-3xl mx-auto h-full px-4 py-4">
					{match(step)
						.with("config", () => <Config />)
						.with("translate", () => <Translate />)
						.exhaustive()}
				</div>
			</div>
		</div>
	)
}
