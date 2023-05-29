FROM node:16-slim

USER node

RUN mkdir -p /home/node/app
RUN mkdir -p /home/node/app/configs
COPY .env /home/node/app/
COPY ./configs /home/node/app/configs/

WORKDIR /home/node/app

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

EXPOSE 9090

CMD [ "node", "." ]
