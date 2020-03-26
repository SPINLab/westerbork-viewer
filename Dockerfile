# build stage
FROM node:10-alpine as build-stage
RUN apk update && \
    apk add --update git && \
    apk add --update openssh
WORKDIR /app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm ci
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]