#!/usr/bin/env bash
set -e

source .env

docker run --rm --name $SERVER_NAME -d \
    -p $SERVER_PORT:443 \
    -v $PWD/mtls.conf:/etc/nginx/conf.d/mtls.conf:ro \
    -v $ROOT_CA_CERT:/etc/nginx/certs/ca.crt:ro \
    -v $CERT_DIR/server.crt:/etc/nginx/certs/server.crt:ro \
    -v $CERT_DIR/server.key:/etc/nginx/certs/server.key:ro \
    nginx

