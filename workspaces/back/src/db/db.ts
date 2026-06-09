import { env } from "@back/lib/env"
import { drizzle } from "drizzle-orm/bun-sqlite"

export const db = drizzle(env.DB_FILE_NAME)
