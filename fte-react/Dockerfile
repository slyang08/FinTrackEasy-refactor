# Build stage
FROM node:20-slim AS builder

WORKDIR /fte-react

# Copy package.json of the front-end project
# COPY package.json pnpm-lock.yaml ./
COPY fte-react/package.json ./
RUN corepack enable && pnpm install

# Copy all front-end source code
COPY fte-react/. ./

# Build static files
RUN pnpm build

# Deployment stage, use nginx to serve static resources
FROM nginx:alpine

# Copy the static files built to the default directory of nginx
COPY fte-react/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /fte-react/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
