import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "@front/components/ui/progress"
import { sentenceTranslator } from "@front/routes/_authed/sentence-translator/-components/atom"
import { useAtomValue } from "jotai"

export const ProgressBar = () => {
	const sentences = useAtomValue(sentenceTranslator.sentencesAtom)
	const indexSentence = useAtomValue(sentenceTranslator.indexSentenceAtom)
	const progress = (indexSentence / sentences.length) * 100
	return (
		<Progress value={progress} className="w-full">
			<ProgressLabel>Session progress</ProgressLabel>
			<ProgressValue />
		</Progress>
	)
}
