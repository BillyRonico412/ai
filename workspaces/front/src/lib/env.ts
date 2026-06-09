import z from "zod"

const zodEnv = z.object({
	VITE_SERVER_URL: z.string(),
})

export const env = zodEnv.parse(import.meta.env)
