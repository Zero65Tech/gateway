FROM node:19-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc .

RUN npm install --only=production

COPY static static
COPY routes routes

CMD [ "npm", "start" ]
