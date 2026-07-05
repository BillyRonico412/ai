import type { auth } from "@back/lib/auth"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

const t = initTRPC
	.context<{
		user: typeof auth.$Infer.Session.user | null
		session: typeof auth.$Infer.Session.session | null
	}>()
	.create({
		transformer: superjson,
	})

export const publicProcedure = t.procedure

const authedMiddleware = t.middleware(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		})
	}
	if (!ctx.user) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You do not have permission to access this resource.",
		})
	}
	return next({
		ctx: {
			user: ctx.user,
			session: ctx.session,
		},
	})
})

export const quotaMiddleware = authedMiddleware.unstable_pipe(
	({ ctx, next }) => {
		if (ctx.user.quota <= 0) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You do not have enough quota to perform this action.",
			})
		}
		return next()
	},
)

export const authedProcedure = publicProcedure.use(authedMiddleware)
export const quotaProcedure = authedProcedure.use(quotaMiddleware)

export const { router } = t
