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

export const authedProcedure = publicProcedure.use((opts) => {
	if (!opts.ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		})
	}
	if (!opts.ctx.user) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You do not have permission to access this resource.",
		})
	}
	return opts.next({
		ctx: {
			user: opts.ctx.user,
			session: opts.ctx.session,
		},
	})
})

export const router = t.router
