FROM hivemq/mqtt-cli

COPY ./demo.sh /bin/
RUN chmod +x /bin/demo.sh

ENTRYPOINT [ "/bin/demo.sh" ]
