# Stage 1

FROM node:10-alpine as build-step

WORKDIR /eps-web

COPY . .

RUN npm install

RUN npm run build --prod

# Stage 2

FROM nginx:1.17.1-alpine

COPY --from=build-step /eps-web/dist /usr/share/nginx/html