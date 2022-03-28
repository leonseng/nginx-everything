# NGINX MTLS

This repository contains scripts to deploy an NGINX container to test mutual TLS connections, both as an endpoint and a proxy.

## Prerequisite

- Create `.env` file using [.env.example](./.env.example) as reference

## Setup

Generate the root CA, server and client key pairs
```
chmod +x generate-server-certs.sh
./generate-certs.sh
```

Start the NGINX server with
```
docker-compose up
```

## Mutual TLS server

Generate client key and certificate
```
chmod +x generate-client-certs.sh
sh generate-client-certs.sh
```

Test MTLS connection using `curl` with the client key and certificate
```
$ . .env
$ curl -k https://localhost:$MTLS_SERVER_PORT \
     --key $CERT_DIR/client.key \
     --cert $CERT_DIR/client.crt
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

If no client key pair is provided, NGINX will return a `400 Bad Request` response
```
$ curl -k https://localhost:$MTLS_SERVER_PORT
<html>
<head><title>400 No required SSL certificate was sent</title></head>
<body>
<center><h1>400 Bad Request</h1></center>
<center>No required SSL certificate was sent</center>
<hr><center>nginx/1.21.3</center>
</body>
</html>
```

## Mutual TLS proxy

https://certauth.idrix.fr is used as a backend to test NGINX initiating the mTLS connection. Here, 2 NGINX servers are defined:

- one that initiates mTLS to the backend where we pass in client key pair generated earlier with the `proxy_ssl_certificate` and `proxy_ssl_certificate_key` directives. The backend returns 200 and prints out the details of the client certificate
     ```
     $ curl -vvv -H "Host: certauth.idrix.fr" localhost:8080/json/
     *   Trying 127.0.0.1:8080...
     * TCP_NODELAY set
     * Connected to localhost (127.0.0.1) port 8080 (#0)
     > GET /json/ HTTP/1.1
     > Host: certauth.idrix.fr
     > User-Agent: curl/7.68.0
     > Accept: */*
     >
     * Mark bundle as not supporting multiuse
     < HTTP/1.1 200 OK
     < Server: nginx/1.21.3
     < Date: Mon, 28 Mar 2022 01:18:51 GMT
     < Content-Type: application/json
     < Transfer-Encoding: chunked
     < Connection: keep-alive
     <
     {"LANG":"C.UTF-8","INVOCATION_ID":"a7f615d74e904aa5a75d575c53d8c316","HTTP_ACCEPT":"*\/*","HTTP_USER_AGENT":"curl\/7.68.0","HTTP_CONNECTION":"close","HTTP_HOST":"certauth.idrix.fr","SSL_CLIENT_I_DN":"CN=rootCA.test,O=NGINX-mtls,C=AU","SSL_CLIENT_S_DN":"CN=client,C=AU","SSL_CLIENT_VERIFY":"FAILED:unable to verify the first certificate","SSL_CLIENT_V_END":"Mar 27 22:46:00 2023 GMT","SSL_CLIENT_V_START":"Mar 27 22:46:00 2022 GMT","SSL_CLIENT_SERIAL":"54229823E16037FBDC4B764E4B86BC8D34536302","SSL_CLIENT_FINGERPRINT":"8a8e6e240075445cef6bfdfcef65d0504f76f707","SSL_SERVER_NAME":"certauth.idrix.fr","SSL_CIPHER":"ECDHE-RSA-AES256-GCM-SHA384","SSL_PROTOCOL":"TLSv1.2","HTTPS":"on","PATH_INFO":"","SERVER_NAME":"certauth.idrix.fr","SERVER_PORT":"443","SERVER_ADDR":"54.36.191.227","REMOTE_PORT":"65148","REMOTE_ADDR":"121.208.219.76","SERVER_PROTOCOL":"HTTP\/1.0","DOCUMENT_URI":"\/json\/index.php","REQUEST_URI":"\/json\/","CONTENT_LENGTH":"","CONTENT_TYPE":"","REQUEST_METHOD":"GET","QUERY_STRING":"","REQUEST_TIME_FLOAT":1648430331.497746,"REQUEST_TIME":1648430331}
     * Connection #0 to host localhost left intact
     ```

- one that initiates simple TLS to the backend. The backend returns `403` in this case
     ```
     $ curl -vvv -H "Host: certauth.idrix.fr"  localhost:8081/json/
     *   Trying 127.0.0.1:8081...
     * TCP_NODELAY set
     * Connected to localhost (127.0.0.1) port 8081 (#0)
     > GET /json/ HTTP/1.1
     > Host: certauth.idrix.fr
     > User-Agent: curl/7.68.0
     > Accept: */*
     >
     * Mark bundle as not supporting multiuse
     < HTTP/1.1 403 Forbidden
     < Server: nginx/1.21.3
     < Date: Mon, 28 Mar 2022 01:18:59 GMT
     < Content-Type: text/html; charset=UTF-8
     < Transfer-Encoding: chunked
     < Connection: keep-alive
     <
     * Connection #0 to host localhost left intact
     ```