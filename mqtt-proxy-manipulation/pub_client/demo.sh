#!/bin/sh
set -e
CLIENT_ID=iotdev1

while true; do
  MSG="The date is $(date)"

  java -cp /app/resources:/app/classes/:/app/libs/* com.hivemq.cli.MqttCLIMain pub \
    -V3 \
    -h proxy \
    -p 8883 \
    -s \
    --cafile /bin/mqtt-cert.pem \
    -t test \
    -m "$MSG" \
    -i $CLIENT_ID \
    -k 3;
  sleep 1;

  echo "Published '$MSG' as $CLIENT_ID"
done
