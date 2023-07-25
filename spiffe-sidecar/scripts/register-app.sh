docker compose exec spire-server \
  ./bin/spire-server entry create \
    -parentID $AGENT_SPIFFE_ID \
    -spiffeID spiffe://example.org/app \
    -selector docker:label:com.example.name:app \
    -x509SVIDTTL 10 \
    -dns app.example.com
