import { db } from "@back/db/db"
import * as authSchema from "@back/db/schema/auth-schema"
import { env } from "@back/lib/env"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth/minimal"

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	trustedOrigins: [env.APP_URL],
	user: {
		additionalFields: {
			quota: {
				type: "number",
				defaultValue: 100,
				input: false,
				required: true,
			},
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...authSchema,
		},
	}),
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
		},
		defaultCookieAttributes: {
			partitioned: true,
			sameSite: "None",
			secure: true,
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
})
