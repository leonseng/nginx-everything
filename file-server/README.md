# File Server

Setup
```bash
docker compose up -d
```

Upload [sample.txt](./sample.txt) to NGINX
```bash
$ curl -T sample.txt localhost:8080/upload/sample.txt
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    12    0     0  100    12      0  12000 --:--:-- --:--:-- --:--:-- 12000
```

Check that file has been uploaded to NGINX in the `/tmp` directory
```bash
$ docker compose exec nginx ls -la /tmp | grep sample.txt
-rw-rw-r-- 1 nginx nginx    12 Feb  8 09:51 sample.txt
```

Download file from NGINX
```bash
$ curl localhost:8080/download/sample.txt
Hello World!
```

NGINX logs
```bash
172.21.0.1 - - [08/Feb/2024:09:49:19 +0000] "PUT /upload/main.key HTTP/1.1" 201 25 "-" "curl/7.68.0"
172.21.0.1 - - [08/Feb/2024:09:49:38 +0000] "GET /download/main.key HTTP/1.1" 200 70737 "-" "curl/7.68.0"
```
