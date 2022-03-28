#!/usr/bin/env bash
set -e

source .env

mkdir -p $CERT_DIR
cd $CERT_DIR

echo "Generating root CA key pair"
openssl genrsa -out rootCA.key 2048
openssl req -x509 -new -sha256 -nodes \
  -key rootCA.key \
  -subj $ROOT_CA_SUBJ \
  -out rootCA.crt \
  -days $ROOT_CA_CERT_VALID_PERIOD

echo "Generating server key pair"
openssl genrsa -out server.key 2048

openssl req -new -sha256 \
  -key server.key \
  -subj $SERVER_CERT_SUBJ \
  -out server.csr

openssl x509 -req -CAcreateserial -sha256 \
  -in server.csr \
  -CA rootCA.crt \
  -CAkey rootCA.key \
  -out server.crt \
  -days $SERVER_CERT_VALID_PERIOD \
  -extfile <(printf "subjectAltName=$SERVER_CERT_SAN")

echo "Generating client key pair"
openssl genrsa -out client.key 2048

openssl req -new -sha256 \
  -key client.key \
  -subj $CLIENT_CERT_SUBJ \
  -out client.csr

openssl x509 -req -sha256 -CAcreateserial \
  -in client.csr \
  -CA rootCA.crt \
  -CAkey rootCA.key \
  -out client.crt \
  -days $CLIENT_CERT_VALID_PERIOD
