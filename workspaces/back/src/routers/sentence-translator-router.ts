import { publicProcedure, router } from "@back/lib/trpc"
import { generateText, Output } from "ai"
import { sentenceTranslatorShared } from "shared/sentence-translator"
import z from "zod"

export const sentenceTranslatorRouter = router({
	generateSenetences: publicProcedure
		.input(sentenceTranslatorShared.zodConfig)
		.query(async ({ input }) => {
			const res = await generateText({
				model: "anthropic/claude-haiku-4.5",
				system: generateSentenceSystemPrompt,
				output: Output.object({
					schema: z.object({
						sentences: z.array(
							z.object({
								sentence: z.string().min(1),
								hint: z.string().min(1),
							}),
						),
					}),
				}),
				prompt: `Génère ${input.nbSentences} phrases en français sur le thème "${input.theme}" pour un niveau ${input.level}.`,
			})
			return res.output.sentences
		}),
	correctAnswer: publicProcedure
		.input(sentenceTranslatorShared.zodCorrectAnswer)
		.query(async ({ input }) => {
			const res = await generateText({
				model: "anthropic/claude-haiku-4.5",
				system: correctAnswerSystemPrompt,
				output: Output.object({
					schema: z.object({
						score: z.number().min(0).max(100),
						weaknesses: z.string().min(1),
						corrections: z.array(
							z.object({
								error: z.string().min(1),
								correction: z.string().min(1),
								explanation: z.string().min(1),
							}),
						),
						optimalTranslation: z.string().min(1),
					}),
				}),
				prompt: `Évalue la traduction anglaise "${input.userAnswer}" pour la phrase française "${input.sentence}".`,
			})
			return res.output
		}),
	generateRandomTopic: publicProcedure.query(async () => {
		const res = await generateText({
			model: "openai/gpt-5-mini",
			system: randomTopicSystemPrompt,
			prompt: "Génère un sujet aléatoire pour un exercice de traduction.",
		})
		return res.text
	}),
})

const generateSentenceSystemPrompt = `
Tu es le moteur de génération d'exercices de l'application SyntaxCraft. 
Ton rôle est de générer des phrases complexes en français conçues spécifiquement pour être traduites en anglais par un développeur francophone.
Tu recevras 4 paramètres : 
- Un thème (ex: "la documentation de React")
- Un niveau CECRL (A1, A2, B1, B2, C1, C2)
- Un concept grammatical optionnel (ex: "Le prétérit")
- Un nombre de phrases requis.
Consignes de génération :
1. Les phrases du tableau doivent être UNIQUEMENT rédigées en français.
2. Adapte strictement la complexité syntaxique au niveau demandé. (A1 = phrases ultra-courtes de tous les jours. B2/C1 = phrases longues avec connecteurs logiques et nuances professionnelles).
3. Si un concept grammatical est fourni, construis la phrase en français de manière à CE QU'ELLE FORCE l'utilisation de ce concept lors de sa traduction en anglais.
4. Pour chaque phrase, fournis un "hint" (indice) contenant UNIQUEMENT la traduction anglaise de mots ou expressions complexes de la phrase française.
5. Le hint NE DOIT PAS révéler la traduction de la phrase: interdit de reformuler la phrase, d'indiquer l'ordre des mots, de donner des morceaux de phrase complets ou de proposer une traduction quasi complète.
6. Le hint doit être court et sous forme de paires lexicales isolées, par exemple: "nuance = subtlety; enjeu = challenge; accroître = to increase".
Tu dois impérativement répondre au format JSON respectant le schéma fourni, sans aucun texte explicatif autour.
`

const correctAnswerSystemPrompt = `
Tu es le professeur d'anglais personnel et mentor linguistique de l'application SyntaxCraft. Ton rôle est d'analyser la traduction anglaise proposée par l'utilisateur pour une phrase française donnée.

Consignes d'évaluation :
1. Note la proposition sur une échelle de 0 à 100. Sois rigoureux sur la grammaire, la conjugaison et l'ordre des mots (Sujet + Verbe + Complément).
2. Si l'input de l'utilisateur est vide ou contient "flemme", attribue un score de 0, indique dans les faiblesses "Exercice passé", et concentre-toi sur l'explication pédagogique de la traduction optimale.
3. Le champ "weaknesses" doit être un RÉSUMÉ court et général (1 phrase, 2 maximum) qui synthétise le type d'erreurs principales (ex: "Quelques erreurs de conjugaison et d'ordre des mots"). N'y mets AUCUN détail mot à mot : les détails précis vont uniquement dans le tableau "corrections".
4. Remplis le tableau des "corrections" uniquement s'il y a des fautes. Chaque élément du tableau doit cibler le mot ou groupe de mots erroné, proposer la correction, et expliquer de manière concise la règle de grammaire sous-jacente en français.
5. Fournis une "optimal_translation" qui représente la manière la plus naturelle et correcte de traduire la phrase au niveau demandé.

Réponds exclusivement au format JSON strict exigé, sans introduction ni conclusion.
`

const randomTopicSystemPrompt = `
Tu es un générateur de sujets aléatoires.
Ton rôle est de proposer un sujet aléatoire pour un exercice de traduction.
Consignes de génération :
1. Le sujet doit être en français.
2. Le sujet doit être concis, idéalement une phrase courte ou un groupe nominal.
3. Le sujet doit être approprié pour un apprenant de niveau A1 à C2.
4. Le sujet doit être original et stimulant, évitant les clichés ou les sujets trop génériques.
5. Le sujet doit être formulé de manière à inspirer la créativité et l'engagement de l'apprenant.
`
