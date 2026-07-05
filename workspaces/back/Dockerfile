FROM bun:latest
WORKDIR /app
COPY . .
RUN bun install
WORKDIR /app/workspaces/back
RUN bunx drizzle-kit push
CMD ["bun", "start"]
