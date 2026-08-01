import {
	type ConfigForm,
	sentenceTranslator,
} from "@front/routes/_authed/sentence-translator/-components/atom"
import { useForm } from "@tanstack/react-form"
import { useSetAtom } from "jotai"
import { sentenceTranslatorShared } from "shared/sentence-translator"

const defaultValues: ConfigForm = {
	theme: "",
	lesson: "",
	nbSentences: 5,
	level: "B1",
}

export const useConfigForm = () => {
	const generateSentences = useSetAtom(sentenceTranslator.generateSentencesAtom)
	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: sentenceTranslatorShared.zodConfig,
		},
		async onSubmit({ value }) {
			await generateSentences(value)
		},
	})
	return form
}

export type SentenceTranslatorFormType = ReturnType<typeof useConfigForm>
