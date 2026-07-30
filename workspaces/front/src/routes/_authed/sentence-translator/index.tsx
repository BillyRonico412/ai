import { sentenceTranslatorAtoms } from "@front/routes/_authed/sentence-translator/-components/atom"
import { Config } from "@front/routes/_authed/sentence-translator/-components/config"
import { Translate } from "@front/routes/_authed/sentence-translator/-components/translate"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { match } from "ts-pattern"

export const Route = createFileRoute("/_authed/sentence-translator/")({
	component: RouteComponent,
	head() {
		return {
			meta: [
				{
					title: "Sentence Translator",
				},
			],
		}
	},
})

function RouteComponent() {
	const step = useAtomValue(sentenceTranslatorAtoms.phaseAtom)
	return (
		<div className="h-full w-full flex flex-col gap-8 overflow-y-auto">
			<div className="container max-w-3xl mx-auto h-full px-4 py-4">
				{match(step)
					.with("config", () => <Config />)
					.with("translate", () => <Translate />)
					.exhaustive()}
			</div>
		</div>
	)
}
