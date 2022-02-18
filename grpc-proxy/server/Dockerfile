FROM golang:1.17-buster AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY server.go ./

RUN go build -o /server

##
## Deploy
##
FROM debian:buster-slim

WORKDIR /

COPY --from=build /server /server

ENTRYPOINT ["/server"]