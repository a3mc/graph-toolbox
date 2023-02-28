FROM node:16-slim

USER node

RUN mkdir -p /home/node/app
COPY .env /home/node/app/

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3583

EXPOSE ${PORT}

CMD [ "node", "./src/index.js" ]
