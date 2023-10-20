# NGINX OIDC reference implementation test

A repo documenting my exploration of NGINX OIDC reference implementation.

## Procedure
1. Build NGINX Plus image with NGINX JS.
1. Configure OIDC identity provider (see [SSO with Auth0 - Configuring Auth0](docs/sso-with-auth0.md#configuring-auth0), or use [Terraform to configure Auth0](https://github.com/leonseng/auth0-oidc-provider-terraform)).
1. Generate NGINX configuration files (see [SSO with Auth0 - Configuring NGINX Plus](docs/sso-with-auth0.md#configuring-nginx-plus)).
1. Launch NGINX Plus container with generated configuration files
    ```
    docker run --rm --name oidc -p 8010:8010 \
      -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
      -v $(pwd)/nginx-openid-connect/frontend.conf:/etc/nginx/conf.d/frontend.conf \
      -v $(pwd)/nginx-openid-connect/openid_connect_configuration.conf:/etc/nginx/conf.d/openid_connect_configuration.conf \
      -v $(pwd)/nginx-openid-connect/openid_connect.js:/etc/nginx/conf.d/openid_connect.js \
      -v $(pwd)/nginx-openid-connect/openid_connect.server_conf:/etc/nginx/conf.d/openid_connect.server_conf \
      repo.example.com/nginx-plus:latest
    ```
1. Test by browsing to [http://localhost:8010](http://localhost:8010).

## Miscellaneous

See [SSO with Auth0](docs/sso-with-auth0.md) for an integration guide for [Auth0](https://auth0.com/).
