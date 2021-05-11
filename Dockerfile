FROM postgres

WORKDIR /usr/src/app

ARG NODE_ENV=development

ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

COPY . .