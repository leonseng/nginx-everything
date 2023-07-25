FROM debian:bookworm-slim

RUN apt update && apt install -y wget tar
RUN wget https://github.com/spiffe/spire/releases/download/v1.7.0/spire-1.7.0-linux-amd64-glibc.tar.gz \
  && tar zvxf spire-1.7.0-linux-amd64-glibc.tar.gz \
  && cp -r spire-1.7.0/. /spire/

# Install Docker
RUN apt install -y ca-certificates curl gnupg \
  && install -m 0755 -d /etc/apt/keyrings \
  && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
  && chmod a+r /etc/apt/keyrings/docker.gpg \
  && echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
  && apt update && apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

WORKDIR /spire/

ENTRYPOINT ["/spire/bin/spire-agent"]
CMD ["run"]
