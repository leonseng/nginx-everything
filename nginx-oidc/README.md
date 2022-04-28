# NGINX OIDC reference implementation test

A repo documenting my exploration of NGINX OIDC reference implementation.

## Procedure
1. Build NGINX Plus image

    Copy `nginx-repo.crt` and `nginx-repo.key` to local directory
    ```
    DOCKER_BUILDKIT=1 docker build --no-cache -t nginxplus --secret id=nginx-crt,src=$(pwd)/nginx-repo.crt --secret id=nginx-key,src=$(pwd)/nginx-repo.key .
    ```
1. Configure OIDC identity provider (see [SSO with Auth0 - Configuring Auth0](docs/sso-with-auth0.md#configuring-auth0)).
1. Generate NGINX configuration files (see [SSO with Auth0 - Configuring NGINX Plus](docs/sso-with-auth0.md#configuring-nginx-plus)).
1. Launch NGINX Plus container with generated configuration files
    ```
    docker run --rm --name oidc -p 8010:8010 \
      -v $(pwd)/nginx-openid-connect/frontend.conf:/etc/nginx/conf.d/frontend.conf \
      -v $(pwd)/nginx-openid-connect/openid_connect_configuration.conf:/etc/nginx/conf.d/openid_connect_configuration.conf \
      -v $(pwd)/nginx-openid-connect/openid_connect.js:/etc/nginx/conf.d/openid_connect.js \
      -v $(pwd)/nginx-openid-connect/openid_connect.server_conf:/etc/nginx/conf.d/openid_connect.server_conf \
      nginxplus \
      nginx -g 'daemon off; load_module modules/ngx_http_js_module.so;'
    ```
1. Test by browsing to [http://localhost:8010](http://localhost:8010).

## Miscellaneous

See [SSO with Auth0](docs/sso-with-auth0.md) for an integration guide for [Auth0](https://auth0.com/).
