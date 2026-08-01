import { Correction } from "@front/routes/_authed/sentence-translator/-components/translate/correction"
import { ProgressBar } from "@front/routes/_authed/sentence-translator/-components/translate/progress"
import { Session } from "@front/routes/_authed/sentence-translator/-components/translate/session"
import { useSessionForm } from "@front/routes/_authed/sentence-translator/-components/translate/session-form"

export const Translate = () => {
	const form = useSessionForm()
	return (
		<div className="w-full h-full flex flex-col gap-8">
			<ProgressBar />
			<Session form={form} />
			<Correction form={form} />
		</div>
	)
}
