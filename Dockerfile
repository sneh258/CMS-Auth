FROM node:19-alpine
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN cd /app; npm install

COPY . .
ENTRYPOINT [ "node", "index.js" ]
