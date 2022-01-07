#!/usr/bin/env bash
set -e

source .env

mkdir -p $CERT_DIR
rm -f $CERT_DIR/client.*

openssl genrsa -out $CERT_DIR/client.key 2048

openssl req -new -sha256 \
  -key $CERT_DIR/client.key \
  -subj $CLIENT_CERT_SUBJ \
  -out $CERT_DIR/client.csr

openssl x509 -req -sha256 -CAcreateserial \
  -in $CERT_DIR/client.csr \
  -CA $ROOT_CA_CERT \
  -CAkey $ROOT_CA_KEY \
  -out $CERT_DIR/client.crt \
  -days $CLIENT_CERT_VALID_PERIOD
