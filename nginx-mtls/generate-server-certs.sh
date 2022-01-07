#!/usr/bin/env bash
set -ex

source .env

mkdir -p $CERT_DIR
rm -f $CERT_DIR/server.*

openssl genrsa -out $CERT_DIR/server.key 2048

openssl req -new -sha256 \
  -key $CERT_DIR/server.key \
  -subj $SERVER_CERT_SUBJ \
  -out $CERT_DIR/server.csr

openssl x509 -req -CAcreateserial -sha256 \
  -in $CERT_DIR/server.csr \
  -CA $ROOT_CA_CERT \
  -CAkey $ROOT_CA_KEY \
  -out $CERT_DIR/server.crt \
  -days $SERVER_CERT_VALID_PERIOD \
  -extfile <(printf "subjectAltName=$SERVER_CERT_SAN")
