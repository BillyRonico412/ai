FROM oven/bun:1
WORKDIR /app
COPY ../../ .
RUN ls
RUN bun install
WORKDIR /app/workspaces/back
RUN ls
RUN bun x drizzle-kit push --config=drizzle.config.ts
CMD ["bun", "start"]
