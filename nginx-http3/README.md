# HTTP3 support

This example shows NGINX supporting HTTP/3 on the client side connection.

## Prereq

- [mkcert](https://github.com/FiloSottile/mkcert)
- [Docker Compose](https://docs.docker.com/compose/)

## Demo

Run the following commands to deploy an NGINX container listening on HTTP/3 and a curl container that supports HTTP/3
```
mkdir -p .tmp
mkcert -cert-file .tmp/cert.pem -key-file .tmp/key.pem http3.example.com
sudo chown 100:101 .tmp/cert.pem .tmp/key.pem
docker compose up -d
```

Test by running the following `curl` command with the `--http3` flag
```
docker compose exec curl-h3 \
  curl -sk -vvv --http3 --connect-to http3.example.com:8443:nginx:8443 \
  https://http3.example.com:8443/headers
```

You should see HTTP/3 being used
```
* Connecting to hostname: nginx
* Connecting to port: 8443
*   Trying 172.21.0.2:8443...
* Connected to (nil) (172.21.0.2) port 8443 (#0)
* using HTTP/3
* h2h3 [:method: GET]
* h2h3 [:path: /headers]
* h2h3 [:scheme: https]
* h2h3 [:authority: http3.example.com:8443]
* h2h3 [user-agent: curl/7.88.1-DEV]
* h2h3 [accept: */*]
* Using HTTP/3 Stream ID: 0 (easy handle 0x560a9feee7a0)
> GET /headers HTTP/3
> Host: http3.example.com:8443
> user-agent: curl/7.88.1-DEV
> accept: */*
>
< HTTP/3 200
< server: nginx/1.23.4
< date: Thu, 06 Apr 2023 05:45:31 GMT
< content-type: application/json
< content-length: 177
< access-control-allow-origin: *
< access-control-allow-credentials: true
< alt-svc: h3=":8443"; ma=86400
< x-protocol: HTTP/3.0
<
{
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/7.88.1-DEV",
    "X-Amzn-Trace-Id": "Root=1-642e5c7b-1ecf6c764f0327031e35aae5"
  }
}
```