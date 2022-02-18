# NGINX as gRPC proxy

Sample setup using Docker to demonstrate NGINX as gRPC proxy. Setup includes the following containers:
- a gRPC [route guide server](https://github.com/grpc/grpc-go/tree/master/examples/route_guide/server) - with minor modification to support specifiying the listen address via `-addr` option
- a gRPC [route guide client](https://github.com/grpc/grpc-go/tree/master/examples/route_guide/client)
- an [NGINX](https://hub.docker.com/_/nginx) proxy

To demonstrate, run the following
```
docker-compose build
docker-compose up
```

You should see logs from `client`
```
Got message First message at point(0, 1)
Got message Second message at point(0, 2)
Got message Third message at point(0, 3)
Got message First message at point(0, 1)
Got message Fourth message at point(0, 1)
Got message Second message at point(0, 2)
Got message Fifth message at point(0, 2)
Got message Third message at point(0, 3)
Got message Sixth message at point(0, 3)
```

and logs from `proxy`
```
"POST /routeguide.RouteGuide/GetFeature HTTP/2.0" 200 84 "-" "grpc-go/1.44.1-dev"
"POST /routeguide.RouteGuide/GetFeature HTTP/2.0" 200 7 "-" "grpc-go/1.44.1-dev"
"POST /routeguide.RouteGuide/ListFeatures HTTP/2.0" 200 5495 "-" "grpc-go/1.44.1-dev"
"POST /routeguide.RouteGuide/RecordRoute HTTP/2.0" 200 13 "-" "grpc-go/1.44.1-dev"
"POST /routeguide.RouteGuide/RouteChat HTTP/2.0" 200 219 "-" "grpc-go/1.44.1-dev"
```
