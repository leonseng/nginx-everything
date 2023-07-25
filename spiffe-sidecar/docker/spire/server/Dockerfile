FROM debian:trixie-slim

RUN apt update && apt install -y wget tar
RUN wget https://github.com/spiffe/spire/releases/download/v1.7.0/spire-1.7.0-linux-amd64-glibc.tar.gz \
  && tar zvxf spire-1.7.0-linux-amd64-glibc.tar.gz \
  && cp -r spire-1.7.0/. /spire/

WORKDIR /spire/

ENTRYPOINT ["/spire/bin/spire-server"]
CMD ["run"]
