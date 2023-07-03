# Mask Sensitive Content

This example demonstrates the logging the request and response body, but with potentially sensitive information masked out with the use of NGINX Javascript.

This is useful for troubleshooting in production environment where you do not want live customer data to be stored in the logs.

The masking is performed via NGINX Javascript function `mask_body` in [log.js](./log.js), which is executed when the response comes back from the backend via the [js_body_filter](http://nginx.org/en/docs/http/ngx_http_js_module.html#js_body_filter) directive. `mask_body` masks the request and response JSON bodies and stores them in the `r.variables.masked_request_json` and `r.variables.masked_response_json` variables, which are then referenced in the [log_format](http://nginx.org/en/docs/http/ngx_http_log_module.html#log_format) directive found in [nginx.conf](./nginx.conf).

The logging of the masked request/response body can be toggled by setting the `$troubleshoot` variable to `0` or `1` in [nginx.conf](./nginx.conf).

## Instructions

Spin up the environment by running
```
docker compose up -d
```

A [JSON file containing sample sensitive information](./sensitive.json) is also provided in this demo. Use `curl` to send [sensitive.json](./sensitive.json) to NGINX, which proxies the request to a `httpbin` backend container.
```
$ curl -H "Connection: Closed" -X POST localhost:8080/anything --data @sensitive.json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {
    "{  \"users\": [    {      \"name\": \"Bob\",      \"phone\": \"0412345678\",      \"credit_card\": \"4567234578973423\"    }  ],  \"request_ip\": \"1.2.3.4\"}": ""
  },
  "headers": {
    "Accept": "*/*",
    "Connection": "close",
    "Content-Length": "140",
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "httpbin",
    "User-Agent": "curl/7.68.0"
  },
  "json": null,
  "method": "POST",
  "origin": "172.22.0.3",
  "url": "http://httpbin/anything"
}
```

Note from above that the sensitive information is untouched in the original request and response bodies, but they are masked in the NGINX container logs:

```
172.22.0.1 - - [03/Jul/2023:05:13:23 +0000] "POST /anything HTTP/1.1" 200 552 "-" "curl/7.68.0"
Request:
{"users":[{"name":"Bob","phone":"04xxxxxxxx","credit_card":"xxxxxxxxxxxxxxx"}],"request_ip":"x.x.x.x"}
Response:
{"args":{},"data":"","files":{},"form":{"{  \"users\": [    {      \"name\": \"Bob\",      \"phone\": \"04xxxxxxxx\",      \"credit_card\": \"xxxxxxxxxxxxxxx\"    }  ],  \"request_ip\": \"x.x.x.x\"}":""},"headers":{"Accept":"*/*","Connection":"close","Content-Length":"140","Content-Type":"application/x-www-form-urlencoded","Host":"httpbin","User-Agent":"curl/7.68.0"},"json":null,"method":"POST","origin":"x.x.x.x","url":"http://httpbin/anything"}
```