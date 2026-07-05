import z from "zod"

const zodEnv = z.object({
	DATABASE_URL: z.string(),
	BETTER_AUTH_URL: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	APP_URL: z.string(),
})

export const env = zodEnv.parse(process.env)
