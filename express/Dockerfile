FROM node:20-slim

# Enable pnpm
RUN corepack enable

WORKDIR /express

# Copy the lockfile and workspace configuration of the monorepo
# COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY express/package.json ./
RUN pnpm install

# Copy the express project file
COPY express/ ./

# Install dependencies (only install the dependencies of the express package)
RUN pnpm install --filter ./express...

# Build (if there is a build command, otherwise it can be omitted)
RUN pnpm --filter ./express... run build

EXPOSE 3000
CMD ["pnpm", "start"]
