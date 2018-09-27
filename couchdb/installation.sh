#!/bin/bash

echo http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/_global_changes

curl -X PUT http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/_users
curl -X PUT http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/_replicator
curl -X PUT http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/_global_changes

curl -X POST http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/_users \
  -H "Content-Type: application/json" \
  -d '{ "_id": "org.couchdb.user:admin", "name": "${$0}", "password":"${$1}", "type":"user", "roles":[] }'

curl -X PUT http://$COUCH_USER:$COUCH_PASS@127.0.0.1:5985/_node/$COUCH_NODE_NAME/_config/httpd/secure_rewrites \
  -d '"false"' -H "Content-Type: application/json"