#!/bin/sh
while true; do
  java -cp /app/resources:/app/classes/:/app/libs/* com.hivemq.cli.MqttCLIMain pub -V3 -t test -m "The date is $(date)" -h proxy -p 1883 -i iotdev1 -k 3;
  sleep 1;
done
