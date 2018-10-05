FROM node:8.12.0

# RUN pip install git+https://github.com/Supervisor/supervisor.git

RUN npm i -g npm@latest

RUN npm i -g grunt-cli kanso concurrently node-gyp

COPY . /srv/

WORKDIR /srv/

CMD ["npm", "run", "production"]
