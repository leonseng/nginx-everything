# NGINX as file cache

This folder contains files to demonstrate NGINX as a caching server.

## Setup

To deploy the setup, run `docker-compose up`.

To test, perform GET requests to the NGINX container, to fetch this `README.md` file hosted on a [static file server](https://hub.docker.com/r/halverneus/static-file-server) container:
```
curl localhost:9090/README.md
```

To verify if the NGINX cache is being used, check the NGINX container logs which indicates if there is a cache `MISS` or `HIT`:
```
nginx_1        | 172.25.0.1 - MISS [26/Aug/2022:07:19:23 +0000]  "GET /README.md HTTP/1.1" 200 23 "-" "curl/7.68.0"
nginx_1        | 172.25.0.1 - HIT [26/Aug/2022:07:19:25 +0000]  "GET /README.md HTTP/1.1" 200 23 "-" "curl/7.68.0"
```

## References

- https://www.nginx.com/blog/nginx-caching-guide/
