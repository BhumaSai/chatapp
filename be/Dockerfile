FROM node:24-alpine

WORKDIR /chatapp/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

ENTRYPOINT [ "npm" ]

CMD [ "run","server" ]