# NGINX Javascript

Sample config used to learn njs.

```
docker run --rm --name njs -p 80:80 \
-v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
-v $(pwd)/main.js:/etc/nginx/njs/main.js \
nginx
```
