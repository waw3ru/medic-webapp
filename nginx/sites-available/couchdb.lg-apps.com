upstream couchdb {
    server couchdb:5984;
}

server {
    listen         80;
    server_name    _;
    error_log /var/log/nginx/error.log;
    location / {
        return       301 https://$host$request_uri;
    }
}

server {
    listen       443 ssl;
    server_name  _;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip                on;
    gzip_disable        "msie6";
    gzip_vary           on;
    gzip_proxied        any;
    gzip_comp_level     6;
    gzip_buffers        16 8k;
    gzip_http_version   1.1;

    gzip_types                  text/plain text/css text/csv text/xml text/javascript
                                application/json application/x-javascript application/xml
                                application/vnd.ms-fontobject application/octet-stream
                                application/x-font-woff multipart/related image/svg+xml;

    ssl_certificate             /etc/nginx/ssl/default.crt;
    ssl_certificate_key         /etc/nginx/ssl/default.key;

    ssl_prefer_server_ciphers   on;
    ssl_session_timeout         10m;
    ssl_session_cache           shared:SSL:5m;
    ssl_protocols               TLSv1.2 TLSv1.1 TLSv1;
    ssl_ciphers                 ECDHE-RSA-AES256-SHA:DHE-RSA-AES256-SHA:DHE-RSA-CAMELLIA256-SHA:DHE-RSA-AES128-SHA:DES-CBC3-SHA:!EXP:!ADH:!aNULL;

}