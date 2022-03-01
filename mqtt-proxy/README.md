# NGINX as MQTT proxy

This demo uses `docker-compose` to deploys the following:
1. a Mosquitto MQTT as a broker
1. an NGINX container to proxy MQTT connections
1. a MQTT subscriber ([HiveMQ MQTT CLI](https://hub.docker.com/r/hivemq/mqtt-cli)) subscribed to the `test` topic
1. a MQTT publisher ([HiveMQ MQTT CLI](https://hub.docker.com/r/hivemq/mqtt-cli)) that publishes messages in the format "The data is &lt;current date&gt; every second to the `test` topic

To start the demo, run `docker-compose up`.

You should see the publisher sending messages through the NGINX proxy to the broker, and the subscriber will print the messages it receives:
```
proxy_1             | 172.23.0.5 [01/Mar/2022:02:25:58 +0000] TCP 200 71 4 172.23.0.2:2883
mosquitto-broker_1  | 1646101560: New connection from 172.23.0.3:39260 on port 2883.
mosquitto-broker_1  | 1646101560: New client connected from 172.23.0.3:39260 as iotdev1 (p2, c1, k3).
sub_client_1        | The date is Tue Mar  1 02:25:59 UTC 2022
mosquitto-broker_1  | 1646101560: Client iotdev1 disconnected.
```
