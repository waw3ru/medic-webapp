#!/bin/bash

echo http://$1:$2@127.0.0.1:5985/_global_changes

curl -X PUT http://$1:$2@127.0.0.1:5985/_users
curl -X PUT http://$1:$2@127.0.0.1:5985/_replicator
curl -X PUT http://$1:$2@127.0.0.1:5985/_global_changes

curl -X POST http://$1:$2@127.0.0.1:5985/_users \
  -H "Content-Type: application/json" \
  -d '{ "_id": "org.couchdb.user:admin", "name": "${1}", "password":"${2}", "type":"user", "roles":[] }'

curl -X PUT http://$1:$2@127.0.0.1:5985/_node/couchdb@$3/_config/httpd/secure_rewrites \
  -d '"false"' -H "Content-Type: application/json"