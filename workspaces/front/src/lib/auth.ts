import type { auth } from "@back/lib/auth"
import { env } from "@front/lib/env"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	baseURL: env.VITE_SERVER_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
})
