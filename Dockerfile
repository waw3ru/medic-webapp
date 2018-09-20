FROM node:8.12.0

ENV COUCH_URL=http://admin:pass@couchdb-image:5984/medic
ENV COUCH_NODE_NAME=couchdb@couchdb-image

RUN npm i -g npm@latest

RUN npm i -g grunt-cli kanso pm2 node-gyp

COPY . /srv/

WORKDIR /srv/

RUN npm i

CMD ["npm", "run", "production"]
