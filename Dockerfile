FROM node:8.12.0

# RUN pip install git+https://github.com/Supervisor/supervisor.git

RUN npm i -g npm@latest

RUN npm i -g grunt-cli kanso pm2 node-gyp

COPY . /srv/

WORKDIR /srv/

RUN npm i

CMD ["npm", "run", "production"]
