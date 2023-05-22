# Smokey
The modern looking glass for modern companies

## Installation

### Dependencies
* docker
* docker-compose
* a reverse proxy (nginx, caddy)

### Download Files
copy the docker-compose.example.yml and place in a new directory of your choice on the host machine that you are hosting Smokey on

copy the config.example.json and rename it to config.json

### Configure config.json
Edit config.json to your liking

API is the api endpoint of your [Caramel instance](https://github.com/kittensaredabest/caramel)

Files URL is the url to the test files which you can create with on the server serving the files (aka the one that would host Caramel)
```bash
fallocate -l 100M 100M.file
fallocate -l 1G 1G.file
fallocate -l 5G 5G.file
fallocate -l 10G 10G.file
```

If you wish to serve test files then have a webserver serve those files on the /files/ path and then set the Files URL to the domain (ex: https://testfiles.nyc.example.com ), Otherwise leave it blank and it will ignore it

bgp: true/false if you want to have bgp route trace in your looking glass (using bird2 in caramel)

pingtrace: true/false if you want to have ping/traceroute/mtr in your looking glass (you would only really disable this if you wanted your looking glass only for bgp route trace, same /w caramel)

If you leave ipv4, ipv6, location, datacenter as a empty string then in the frontend it will show as Not Set

and obv if u want to add more locations / groups then just add more to the array.

### Docker
Pull the docker container
```
docker compose pull
```

Start the docker container
```
docker compose up -d
```
The service will now lisen on port 3000 locally


### Reverse Proxy

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