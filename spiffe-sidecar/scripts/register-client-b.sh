docker compose exec spire-server \
  ./bin/spire-server entry create \
    -parentID $AGENT_SPIFFE_ID \
    -spiffeID spiffe://example.org/client-b \
    -selector docker:label:com.example.name:client-b \
    -x509SVIDTTL 10
