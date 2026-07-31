# Multi-Stage Dockerfile for Production Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY vercel.json /usr/share/nginx/html/vercel.json
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
