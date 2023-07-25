docker compose exec spire-server \
  ./bin/spire-server entry create \
    -parentID $AGENT_SPIFFE_ID \
    -spiffeID spiffe://example.org/client-a \
    -selector docker:label:com.example.name:client-a \
    -x509SVIDTTL 10
