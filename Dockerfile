FROM node:21-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

COPY . .

FROM base as installer
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json tsconfig.json

WORKDIR /app

RUN npm install

RUN npm run build

RUN npm run serve -- --build --port 80 --host 0.0.0.0
# FROM devforth/spa-to-http:latest as runner
# WORKDIR /app

# ARG PORT

# ENV PORT $PORT


# COPY --from=installer /app/build .
