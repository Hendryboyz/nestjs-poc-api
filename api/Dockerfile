ARG NODE_TAG=18.12.0-alpine

FROM node:$NODE_TAG as build-stage

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY *.json ./
COPY src src
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:$NODE_TAG

RUN apk update
RUN apk add ffmpeg

WORKDIR /app

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
EXPOSE 8000

CMD ["node", "dist/main"]