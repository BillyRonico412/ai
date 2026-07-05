import { db } from "@back/db/db"
import { user } from "@back/db/schema/auth-schema"
import { and, eq, gte, sql } from "drizzle-orm"

export const increaseQuota = async (userId: string, nb = 1) => {
	await db
		.update(user)
		.set({
			quota: sql`quota - ${nb}`,
		})
		.where(and(eq(user.id, userId), gte(user.quota, nb)))
}
