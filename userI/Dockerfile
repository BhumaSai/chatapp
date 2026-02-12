FROM node:24-alpine

WORKDIR /chatapp/frontend

COPY package*.json ./

RUN npm install 

COPY . .


ENTRYPOINT [ "npm" ]

CMD [ "run","start" ]