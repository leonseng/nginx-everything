#!/usr/bin/env bash

set -e

mkdir -p .certs

echo "### Create self-signed CA ###"
openssl req -config ./scripts/spire-ca-config -new -newkey rsa:2048 -nodes \
  -subj "/C=AU/ST=VIC/L=Melbourne/O=Seng/CN=Root CA" -x509 -keyout .certs/rootCA-key.pem -out .certs/rootCA.pem

echo "### Create x509 key pair for agent to perform node attestation via x509pop ###"
openssl req -nodes -newkey rsa:2048 -keyout .certs/agent-key.pem -out .certs/agent.csr -subj "/C=AU/ST=VIC/L=Melbourne/O=Seng/CN=Spire Agent"
openssl x509 -req -in .certs/agent.csr -CA .certs/rootCA.pem -CAkey .certs/rootCA-key.pem \
  -CAcreateserial -out .certs/agent.pem -days 825 -sha256 -extfile ./scripts/spire-agent-extensions
