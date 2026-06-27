import { env } from "@front/lib/env"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	baseURL: env.VITE_SERVER_URL,
})
