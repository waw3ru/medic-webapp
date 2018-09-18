
server {
    listen         80;
    server_name    _;
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    # Prevent "clickjacking" attacks:
    #   This disallows external sites from embedding any of our pages in
    #   an <iframe>. Since medic-reporter currently uses an <iframe>, we've
    #   set the value to SAMEORIGIN instead of DENY. If we ever stop using
    #   <iframes>s, we should probably switch this back to DENY.

    add_header X-Frame-Options  SAMEORIGIN;

    location @app-redirect {
        return 302 /medic/_design/medic/_rewrite;
    }

    location ~ ^/_utils/(.*) {
        deny all;
    }

    location / {
        proxy_pass              http://medic-webapp:5988;
        error_page              502 503 504 = @fallback;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location @fallback {
        proxy_pass              http://medic-webapp:5988;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    }

}