FROM oven/bun:1
WORKDIR /app
COPY ../../ .
RUN bun install
WORKDIR /app/workspaces/back
CMD ["sh", "-c", "bun x drizzle-kit push --config=drizzle.config.ts && bun start"]