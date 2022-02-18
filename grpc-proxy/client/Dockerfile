FROM golang:1.17-buster AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY client.go ./

RUN go build -o /client

##
## Deploy
##
FROM debian:buster-slim

WORKDIR /

COPY --from=build /client /client

ENTRYPOINT ["/client"]