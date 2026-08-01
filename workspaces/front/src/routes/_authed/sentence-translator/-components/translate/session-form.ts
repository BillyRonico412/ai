import { sentenceTranslator } from '@front/routes/_authed/sentence-translator/-components/atom'
import { useForm } from '@tanstack/react-form'
import { useSetAtom } from 'jotai'
import z from 'zod'

const zodSession = z.object({
  userAnswer: z.string(),
})

type SessionInput = z.infer<typeof zodSession>
const defaultValues: SessionInput = {
  userAnswer: "",
}

export const useSessionForm = () => {
  const checkAnswer = useSetAtom(sentenceTranslator.checkAnswerAtom)
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: zodSession,
    },
    onSubmit: async ({ value }) => {
      await checkAnswer(value.userAnswer)
    },
  })
  return form
}

export type SessionForm = ReturnType<typeof useSessionForm>