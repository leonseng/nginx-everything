## NGINX OIDC Reference Implementation code walkthrough

User sends initial request to NGINX
Hits `location /` in `frontend.conf`
NGINX attempts to validate JWT for the session stored in `session_jwt` variable, which would not be set at this point. Returns 401, and response page @do_oidc_flow
`location @do_oidc_flow` runs njs `oidc.auth`
`oidc.auth`:
1. respond with 302 redirect to `$oidc_authz_endpoint`, or Auth0 `/authorize` endpoint

User now logs in via Auth0 portal
On successful login, Auth0 responds to browser with 302 redirecting to callback URL localhost/_codexch with authorization code
```
302

http://localhost:8010/_codexch?code=ecORpHI5BkTb24fGnM_5S8UjzE6N-ZsSorbauPQB_VN8q&state=X0gmpgmADyEMsXY2HHILOPNHmJQwkmN34OH_JOP606s
```

Browser hits NGINX `/_codexch` in `openid_connect.server_conf`, which runs `oidc.codeExchange` njs

`oidc.codeExchange`:
1. sends request to `/_token` in `openid_connect.server_conf` which passes authorization code and one of the following:
    - PKCE enabled: code verifier
    - PKCE not enabled: client_secret
    to `$oidc_token_endpoint` or Auth0 `/oauth/token`
1. gets a response from Auth0 containing the ID and access token, e.g.
    ```
    {
      "access_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9sZW9uc2VuZy5hdS5hdXRoMC5jb20vIn0..HGXINu0EJfPI3DqM.G0wDWPn3yP2xmKEDZHNBwiKdarkwnN3tv_DCrazHgjTdDNuXXqMJwGrd58Eo5DyBYSLTxCR15-yXv-ZTDFqiPLIoGqf4eIvkzLAC4po6HieIcKQhmoChJvhbt5noV4emr4ikewxLXcIXLqoBkZEPzMS4tSJFC7zyTDZygO7ObHeZUdrlsut7sIHXb9AkFKj1L0sCsYOcfMOSdjuHX7D7i3l9V5lu8A-HH3OL_23-WyzFByxc9oNnDtc4J-NL0DgyE_zkBCdH7GmJwf2LfgFgeg5dtQ6XgF8Iq1GukLlGfPk_tiffz5gPjWFTlsL5_K4qDtyGaTGgfoVC.qVSbRw8EoJI9mY1EqVd_zA",
      "refresh_token": "D7X2ZlbE1E4i7axrvLh6ceoFHEo08oHDIW3JlR2TLImIg",
      "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InF2OXhiNWg5T1l5LXVKZ1Z5REV5eCJ9.eyJuaWNrbmFtZSI6IncubGVvbi5zZW5nIiwibmFtZSI6IncubGVvbi5zZW5nQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82MTI2Zjk5NjhiOTQ0ZGY2Yjk4MDhhM2M5NjcyMGYxZj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRncucG5nIiwidXBkYXRlZF9hdCI6IjIwMjItMDQtMTRUMDE6NTI6MzguMDMwWiIsImVtYWlsIjoidy5sZW9uLnNlbmdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vbGVvbnNlbmcuYXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYyM2E1ZTk1YWVjN2MyMDA2YThiNTBjZCIsImF1ZCI6IlluS0JHWHp2czZFRU9oUnFaWHVkeWt5eTY5T01ZSE9hIiwiaWF0IjoxNjQ5OTAxMTU4LCJleHAiOjE2NDk5MzcxNTgsIm5vbmNlIjoibmZwV3haclNmY01LbHRLU1FweERrV1Fyc3ZicWZHZmlfVkhWM3ZXLUdYbyJ9.uwI_UFdACOjUpZoMnu7wN1LjL5k9eD2RZsTQxX41QcL_Tw6WjJOqQe8MNjrWYLKOAgFTjZf98AIwZgA2MWYArjRDHIol0OpbiEXh6t-HlCaBDrJvH1SRqPqBQ_tElo1WAYyHWhsDAK5Zki416MkcIjGdJayfyQP5oW9B9Y0QJMlMhXl6TCu-H7VBGg9EwA6Qo1Wv7CxZMCHboLY0glDJEG0_w5nPDd_9HjvagqXbiCDx-fcdrloe9N4z6O87fUtbUNudh5s6wMEBLEq2bUC-ggcfNqIYw2tk05CErK5xVZ2eSqyLdTklt9EalZMbvkQL7KCgMtS1vBC2Hx04d9KMMg",
      "scope": "openid profile email offline_access",
      "expires_in": 86400,
      "token_type": "Bearer"
    }
    ```
1. sends id_token to `/_id_token_validation` which calls the `validateIdToken` njs, checking the claims
1. Store refresh token from response in `new_refresh` variable
1. Store ID token in KV store under `new_session` variable - which is mapped to the NGINX request ID
1. sends 302 redirect to original app url with `Set-Cookie` set to `auth_token=<NGINX request ID>`

Browser sends request with `auth_token` cookie

NGINX gets `session_jwt` (should be empty now?) and `refresh_token` from KV store

Hits `location /` in `frontend.conf`
`auth_jwt` fails again triggering `error_page` > `@do_oidc_flow` > njs `oidc.auth`

`oidc.auth`, this time we have `refresh_token`:
1. send request to `/_refresh` which triggers a token refresh to `$oidc_token_endpoint`
1. Auth0 responds with ID token and access_token
1. send id token to `/_id_token_validation`
