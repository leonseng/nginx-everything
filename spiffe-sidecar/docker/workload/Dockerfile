FROM nginx:bookworm

RUN mkdir -p /etc/nginx/ssl \
  && mkdir /spiffe-helper \
  && apt update \
  && apt install -y wget tar procps

WORKDIR /spiffe-helper

COPY docker/workload/nginx_check.sh /spiffe-helper/nginx_check.sh
RUN chmod +x /spiffe-helper/nginx_check.sh

RUN wget https://github.com/spiffe/spiffe-helper/releases/download/v0.6.0/spiffe-helper-v0.6.0.tar.gz \
  && tar zvxf spiffe-helper-v0.6.0.tar.gz

ENTRYPOINT ["/spiffe-helper/spiffe-helper"]
CMD ["-config", "/spiffe-helper/helper.conf"]
