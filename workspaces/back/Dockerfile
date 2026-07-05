FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
WORKDIR /app/workspaces/back
RUN bun x drizzle-kit push
CMD ["bun", "start"]
