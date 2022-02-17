# NGINX as websocket proxy

Sample setup using Docker to demonstrate NGINX as websocket proxy. Setup includes:
- a websocket server running [web-socket-test](https://hub.docker.com/r/ksdn117/web-socket-test) image
- an [NGINX](https://hub.docker.com/_/nginx) proxy

Run `docker-compose up` to start the containers.

Use [wscat](https://github.com/websockets/wscat) to connect to the websocket server via NGINX on `localhost:8020`
```
$ wscat --connect ws://localhost:8020
Connected (press CTRL+C to quit)
> hello
< Server received from client: hello
> world
< Server received from client: world
>
```

NGINX will proxy the connection to the websocket server by its DNS name `websocket-server` as defined in the `docker-compose.yml` file.
