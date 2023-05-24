# Smokey
The modern looking glass for modern companies

## Installation

### Dependencies
- docker
- docker-compose
- a reverse proxy (nginx, caddy)

### Download Files
1. Copy the `docker-compose.example.yml` and place it in a new directory of your choice on the host machine where you are hosting Smokey.
2. Copy the `config.example.json` and rename it to `config.json`.

### Configure config.json
Edit `config.json` to your liking.

- `api` is the API endpoint of your [Caramel instance](https://github.com/kittensaredabest/caramel).
- `filesUrl` is the URL to the test files, which you can create on the server hosting the files (the one that would host Caramel).
    ```bash
    fallocate -l 100M 100M.file
    fallocate -l 1G 1G.file
    fallocate -l 5G 5G.file
    fallocate -l 10G 10G.file
    ```
    If you wish to serve test files, have a web server serve those files on the `/files/` path and set the `Files URL` to the domain (e.g., https://lg-nyc-api.example.com ). Otherwise, leave it blank and it will be ignored.
- `bgp`: `true/false` if you want to have BGP route trace in your looking glass (using bird2 in caramel).
- `pingtrace`: `true/false` if you want to have ping/traceroute/mtr in your looking glass. You would only disable this if you want your looking glass to only show BGP route trace (same with caramel).
- If you leave `ipv4`, `ipv6`, `location`, and `datacenter` as empty strings, they will be displayed as "Not Set" in the frontend.
- You can add more locations/groups by adding more elements to the array.

### Docker
Pull the docker container:
```bash
docker compose pull
```

Start the docker container:
```bash
docker compose up -d
```
The service will now lisen on port 3000 on the host machine.


### Reverse Proxy
Here are some examples of reverse proxy configurations. Although, you can use any reverse proxy you want.
#### Nginx
```
server {
    listen 80;
    listen [::]:80;
    server_name lg.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen [::]:443 ssl;
    listen 443 ssl;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;

    ssl_certificate /etc/letsencrypt/live/lg.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lg.example.com/privkey.pem;

    server_name lg.example.com;

    location / {
        include proxy_params;
        proxy_pass http://127.0.0.1:3000;
    }
}
```

#### Caddy
```
lg.example.com {
    reverse_proxy localhost:3000
}
```