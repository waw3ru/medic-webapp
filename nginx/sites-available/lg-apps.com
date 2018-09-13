upstream concierge {
    server localhost:280;
}
upstream medic-api {
    server medic-webapp:5988;
}

server {
    listen         80;
    server_name    _;
    error_log /var/log/nginx/error.log;
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen       443 ssl;
    server_name  _;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    ssl_certificate             /etc/nginx/ssl/default.crt;
    ssl_certificate_key         /etc/nginx/ssl/default.key;

    # Prevent "clickjacking" attacks:
    #   This disallows external sites from embedding any of our pages in
    #   an <iframe>. Since medic-reporter currently uses an <iframe>, we've
    #   set the value to SAMEORIGIN instead of DENY. If we ever stop using
    #   <iframes>s, we should probably switch this back to DENY.

    add_header X-Frame-Options  SAMEORIGIN;

    location = / {
        proxy_pass              http://concierge;
        error_page              502 503 504 = @app-redirect;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
    }

    location @app-redirect {
        return 302 /medic/_design/medic/_rewrite;
    }

    location ~ ^/_utils/(.*) {
        deny all;
    }

    location / {
        proxy_pass              http://concierge;
        error_page              502 503 504 = @fallback;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
    }

    location @fallback {
        proxy_pass              http://medic-api;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
    }

    location /dashboard {
        proxy_pass              http://concierge;
        error_page              502 503 504 = @fallback;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
    }

    location /_users {
        proxy_pass              http://concierge;
        error_page              502 503 504 = @fallback;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
    }

    location /_log {
        proxy_pass              http://concierge;
        error_page              502 503 504 = @fallback;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
    }

    location /_replicate {
        proxy_pass              http://concierge;
        error_page              502 503 504 = @fallback;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
    }

    error_page   500 502 503 504  /50x.html;

    location = /50x.html {
        root html;
    }
}