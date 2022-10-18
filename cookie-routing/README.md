# NGINX Route by Cookie

This folder contains files to deploy an environment demonstrating NGINX's capability to route to different upstream servers based on cookie value.

## How it works

This example uses the NGINX [map](http://nginx.org/en/docs/http/ngx_http_map_module.html#map) directive to set the `$upstream_site` variable based on the value of cookie `site` through the variable `$cookie_site`. NGINX then proxies the request to an upstream server based on the value of the `$upstream_site` variable.

## Setup

The environment is deployed using Docker Compose, which includes:
- an upstream server `site-a` serving a static page with a button to set a cookie `site=b`
- an upstream server `site-b` serving a static page with a button to unset the cookie `site`
- an NGINX proxy that routes to the upstream based on the value of cookie `site`

![NGINX route by cookie](./images/cookie-routing.png)

To deploy the demo:

1. In the terminal, run `docker compose up`.
1. In a browser, navigate to [localhost:8080](http://localhost:8080). You should see a page from `site A` with a `Toggle site` button.
1. Click on the button, which sets a cookie `site=b` to your session, and reloads the page. NGINX will now route you to `site B`.
1. You can return to `site A` by clicking on the `Toggle site` button on `site B`, which removes the cookie `site`, causing NGINX to route you to `site A`.
