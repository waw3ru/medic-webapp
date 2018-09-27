FROM node:8.12.0

# RUN pip install git+https://github.com/Supervisor/supervisor.git

RUN npm i -g npm@latest

RUN npm i -g grunt-cli kanso concurrently node-gyp

COPY . /srv/

WORKDIR /srv/

RUN npm i

WORKDIR /srv/api/

RUN npm i

WORKDIR /srv/sentinel/

RUN npm i

CMD ["npm", "run", "production"]
