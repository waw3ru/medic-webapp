#!/bin/bash

echo "checking system"

if which docker > /dev/null
    then
        echo "docker is installed"
    else
        echo "please ensure to have docker installed"
        exit 0
    fi

if which docker-compose > /dev/null
    then
        echo "docker-compose installed is installed"
    else
        echo "please ensure to have docker-compose installed"
        exit 0
    fi

if which node > /dev/null
    then
        echo "node is installed"
    else
        echo "please ensure to have node version 8.+ installed"
        exit 0
    fi

if [[ "$(node --version | grep 'v8.*.*')" ]]
then
    echo "correct node version installed"
else
    echo "please ensure to have node version 8.+ installed"
    exit 0
fi

medic_env="./environments/.medic"
couch_env="./environments/.couch"

if [ ! -f ./environments/.medic ]; then
   echo "File ./environments/.medic does not exist. Please create one."
   exit 1
fi

if [ ! -f ./environments/.couch ]; then
   echo "File ./environments/.couch does not exist. Please create one."
   exit 1
fi

echo "DONE!"

printf "\n"

docker-compose down -v

printf "\n"

echo "exporting environment variables"

export COUCH_USER=$1
export COUCH_PASS=$2
export COUCH_NODE_NAME=couchdb@$3
export NODE_ENV=$4

export COUCH_URL=http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/medic

printf "\n"

echo "starting docker-compose couchdb service"
docker-compose up -d --build couchdb
