
# create required folders and file for couchdb to run well
curl -X PUT http://admin:pass@127.0.0.1:5985/_users
curl -X PUT http://admin:pass@127.0.0.1:5985/_replicator
curl -X PUT http://admin:pass@127.0.0.1:5985/_global_changes

# modify config to always require authentication
curl -X PUT http://admin:pass@127.0.0.1:5985/_node/couchdb@couchdb-image/_config/couch_httpd_auth/require_valid_user \
  -d '"true"' -H "Content-Type: application/json"

curl -X POST http://admin:pass@127.0.0.1:5985/_users \
  -H "Content-Type: application/json" \
  -d '{"_id": "org.couchdb.user:admin", "name": "admin", "password":"pass", "type":"user", "roles":[]}'

# modify extra couchdb configs
curl -X PUT --data '"stderr"' http://admin:pass@127.0.0.1:5985/_node/couchdb@couchdb-image/_config/log/writer
curl -X PUT --data '"warn"' http://admin:pass@127.0.0.1:5985/_node/couchdb@couchdb-image/_config/log/level

# installation of the garden dashboard
# curl -X PUT http://admin:pass@localhost:5985/_node/couchdb@couchdb-image/_config/httpd/secure_rewrites \
  # -d '"false"' -H "Content-Type: application/json"