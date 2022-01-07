# NGINX MTLS

This repository contains scripts to deploy an NGINX container to test mutual TLS connection.

## Prerequisite

- Root CA key and certificate to sign server and client certificates
- Create `.env` file using [.env.example](./.env.example) as reference

## Setup

Generate the server key and certificate
```
chmod +x generate-server-certs.sh
./generate-server-certs.sh
```

Start the NGINX server with
```
chmod +x start-server.sh
./start-server.sh
```

## Verify

Generate client key and certificate
```
chmod +x generate-client-certs.sh
sh generate-client-certs.sh
```

Test MTLS connection using `curl` with the client key and certificate
```
. .env
curl -k --cacert $ROOT_CA_CERT \
     --key .certs/client.key \
     --cert .certs/client.crt \
     https://localhost:$SERVER_PORT
```

You should see a `400 Bad Request` response if no client certificate is provided:
```
$ curl -k https://localhost:$SERVER_PORT
<html>
<head><title>400 No required SSL certificate was sent</title></head>
<body>
<center><h1>400 Bad Request</h1></center>
<center>No required SSL certificate was sent</center>
<hr><center>nginx/1.21.3</center>
</body>
</html>
```
