FROM node:8.11.0

ENV COUCH_URL=http://admin:pass@couchdb-image:5985/medic
ENV COUCH_NODE_NAME=couchdb@couchdb-image

RUN npm i -g grunt-cli kanso

COPY . /srv/

WORKDIR /srv/

RUN yarn install

WORKDIR /srv/api

RUN yarn install

WORKDIR /srv/sentinel

RUN yarn install

WORKDIR /srv/

RUN grunt dev-webapp

RUN yarn start
