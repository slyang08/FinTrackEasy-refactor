# Build stage
FROM node:20-slim AS builder

# WORKDIR /fte-react
WORKDIR /app

# Copy package.json of the front-end project
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install

# Copy all front-end source code
# COPY . .
COPY fte-react ./fte-react

# RUN pnpm run build
WORKDIR /app/fte-react
RUN pnpm install
RUN pnpm run build

# Deployment stage, use nginx to serve static resources
FROM nginx:alpine

# Copy the static files built to the default directory of nginx
COPY fte-react/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/fte-react/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]