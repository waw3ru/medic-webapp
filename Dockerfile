FROM node:8.11.0

ENV COUCH_URL=http://admin:pass@couchdb-image:5985/medic
ENV COUCH_NODE_NAME=couchdb@couchdb-image

RUN npm i -g npm@5.3.0

RUN npm i -g grunt-cli kanso

COPY . /srv/

WORKDIR /srv/

RUN npm install

WORKDIR /srv/api

RUN npm install

WORKDIR /srv/sentinel

RUN npm install

WORKDIR /srv/

# RUN grunt dev-webapp-no-npm

RUN yarn start
