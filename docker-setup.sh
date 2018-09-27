#!/bin/bash

printf "Checking System...\n"

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

if [ ! -f ./environments/.medic ]; then
   echo "File ./environments/.medic does not exist. Please create one."
   exit 1
fi

if [ ! -f ./environments/.couch ]; then
   echo "File ./environments/.couch does not exist. Please create one."
   exit 1
fi

if [ ! -f .docker-setup-done ];
    then
        printf "\nRunning removing pre-exising docker-compose services...\n"
        docker-compose down -v

        printf "\nExporting environment variables...\n"
        export COUCH_USER=$1
        export COUCH_PASS=$2
        export COUCH_NODE_NAME=couchdb@$3
        export NODE_ENV=$4
        export COUCH_URL=http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/medic

        printf "\nStarting docker-compose couchdb service...\n"
        docker-compose up -d --build couchdb

        printf "\nWAITING FOR COUCHDB TO WARM UP...\n"
        sleep 15

        printf "\nSetting up couchdb\n"
        source ./couchdb/installation.sh $COUCH_USER $COUCH_PASS $3

        printf "\nInstalling all relevant dependencies...\n"
        npm i -g grunt-cli kanso && npm install

        printf "\nBuilding medic...\n"
        grunt build

        printf "\nDeploying medic...\n"
        grunt deploy

        printf "\nBuilding medic docker image...\n"
        docker-compose build --no-cache webapp

        printf "\nRunning medic container...\n"
        docker-compose up -d webapp

        printf "\nDONE!"
        touch .docker-setup-done
    else
        echo "!!ALREADY SETUP MEDIC...!!"
    fi