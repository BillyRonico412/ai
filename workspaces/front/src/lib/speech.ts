const voices = speechSynthesis.getVoices().filter((v) => v.lang === "en-US")

export const speek = (params: { text: string }) => {
	speechSynthesis.cancel()

	const indexVoice = Math.floor(Math.random() * voices.length)
	const utterance = new SpeechSynthesisUtterance(params.text)

	utterance.lang = "en-US"
	utterance.rate = 0.7
	utterance.voice = voices[indexVoice]
	utterance.volume = 1
	utterance.pitch = 1

	speechSynthesis.speak(utterance)
}
