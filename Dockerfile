FROM node:16-slim

USER node

RUN mkdir -p /home/node/app
COPY .env /home/node/app/

WORKDIR /home/node/app

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

EXPOSE 3583

CMD [ "node", "./src/index.js" ]
