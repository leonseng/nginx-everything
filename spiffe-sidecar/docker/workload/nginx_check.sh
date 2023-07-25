#!/bin/bash

set -e

# Check if nginx process is running
if pgrep -x "nginx" >/dev/null; then
    nginx -s reload
else
    nginx
fi
