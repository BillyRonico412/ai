import { quotaProcedure, router } from "@back/lib/trpc"
import { increaseQuota } from "@back/lib/utils"
import { generateText, Output } from "ai"
import { sentenceTranslatorShared } from "shared/sentence-translator"
import z from "zod"

export const sentenceTranslatorRouter = router({
	generateSentences: quotaProcedure
		.input(sentenceTranslatorShared.zodConfig)
		.query(async ({ input, ctx }) => {
			const res = await generateText({
				model: "anthropic/claude-sonnet-5",
				system: generateSentenceSystemPrompt,
				reasoning: "none",
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
			await increaseQuota(ctx.user.id)
			return res.output.sentences
		}),
	correctAnswer: quotaProcedure
		.input(sentenceTranslatorShared.zodCorrectAnswer)
		.query(async ({ input, ctx }) => {
			const res = await generateText({
				model: "anthropic/claude-sonnet-5",
				system: correctAnswerSystemPrompt,
				reasoning: "none",
				output: Output.object({
					schema: z.object({
						score: z.number().min(0).max(100),
						strengths: z.string().min(1),
						weaknesses: z.string().min(1),
						corrections: z.array(
							z.object({
								error: z.string().min(1),
								correction: z.string().min(1),
								explanation: z.string().min(1),
							}),
						),
						keyPointsToImprove: z.array(
							z.object({
								notion: z.string().min(1),
								category: z.enum([
									"grammaire",
									"conjugaison",
									"vocabulaire",
									"syntaxe",
								]),
							}),
						),
						optimalTranslation: z.string().min(1),
					}),
				}),
				prompt: `Évalue la traduction anglaise "${input.userAnswer}" pour la phrase française "${input.sentence}".`,
			})
			await increaseQuota(ctx.user.id)
			return res.output
		}),
	generateRandomTopic: quotaProcedure.mutation(async ({ ctx }) => {
		const res = await generateText({
			model: "anthropic/claude-sonnet-5",
			system: randomTopicSystemPrompt,
			temperature: 1.0,
			reasoning: "none",
			output: Output.object({
				schema: z.object({
					subject: z.string().min(1),
				}),
			}),
			prompt: `Génère un sujet concret et original pour un exercice de traduction français-anglais.
N'utilise jamais les sujets suivants : réseaux sociaux, lecture, changement climatique, cuisine française.
Identifiant de génération : ${crypto.randomUUID()}`,
		})
		await increaseQuota(ctx.user.id)
		return res.output.subject
	}),
})

const generateSentenceSystemPrompt = `
Tu es le moteur de génération d'exercices de SyntaxCraft : tu génères des phrases en français à traduire en anglais par un développeur francophone.
Tu reçois : un thème, un niveau CECRL (A1 à C2), un concept grammatical optionnel et un nombre de phrases.
Consignes :
1. Les phrases sont rédigées UNIQUEMENT en français.
2. Adapte strictement la complexité au niveau (A1 = phrases ultra-courtes du quotidien ; B2/C1 = phrases longues avec connecteurs logiques et nuances professionnelles).
3. Si un concept grammatical est fourni, construis la phrase pour FORCER l'usage de ce concept lors de la traduction anglaise.
4. Pour chaque phrase, fournis un "hint" contenant UNIQUEMENT la traduction anglaise des mots ou expressions complexes.
5. Le hint NE DOIT PAS révéler la traduction : pas de reformulation, d'ordre des mots, de morceaux de phrase complets ni de traduction quasi complète.
6. Le hint est court, sous forme de paires lexicales isolées, ex: "nuance = subtlety; enjeu = challenge; accroître = to increase".
Réponds impérativement au format JSON du schéma fourni, sans aucun texte autour.
`

const correctAnswerSystemPrompt = `
Tu es le professeur d'anglais de SyntaxCraft : tu analyses la traduction anglaise proposée par l'utilisateur pour une phrase française.

Consignes :
1. Note sur 0 à 100 : rigoureux sur la grammaire, un peu moins sur la conjugaison, indulgent sur le vocabulaire. La note reflète la qualité globale (fidélité au sens, fluidité, précision grammaticale).
2. Si l'input est vide ou contient "flemme" : score 0, "strengths" = "Aucun point positif", "weaknesses" = "Exercice passé", et concentre-toi sur l'explication pédagogique de la traduction optimale.
3. "strengths" : RÉSUMÉ court et général (1 à 2 phrases) des points positifs (ex: "Bon vocabulaire et structure correcte").
4. "weaknesses" : RÉSUMÉ court et général (1 à 2 phrases) du type d'erreurs principales, SANS détail mot à mot (les détails vont dans "corrections").
5. "corrections" : uniquement s'il y a des fautes. Chaque élément cible le mot/groupe erroné, propose la correction et explique brièvement la règle en français.
6. "keyPointsToImprove" : les NOTIONS à réviser déduites des erreurs, avec :
   - "notion": nom précis en français (ex: "Le prétérit simple", "L'accord sujet-verbe", "Les prépositions de lieu").
   - "category": uniquement "grammaire", "conjugaison", "vocabulaire" ou "syntaxe".
   N'inclus pas les notions maîtrisées, évite les doublons ; tableau vide si aucune erreur.
7. "optimal_translation" : la traduction la plus naturelle et correcte au niveau demandé.
Réponds exclusivement au format JSON strict exigé, sans introduction ni conclusion.
`

const randomTopicSystemPrompt = `
Tu génères un sujet aléatoire pour un exercice de traduction.
Consignes :
1. Le sujet est en français.
2. Très simple et concis, idéalement une phrase courte ou un groupe nominal.
3. Le résultat contient uniquement le sujet, sans texte explicatif ni introduction.
4. Choisis un domaine concret différent à chaque génération.
`
