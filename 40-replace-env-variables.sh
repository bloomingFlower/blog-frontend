#!/bin/sh

set -e

ME=$(basename $0)

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

envsubst '${REACT_APP_API_URL} ${REACT_APP_SSE_API_URL} ${REACT_GRPC_API_URL} ${GRPC_API_KEY} ${RSS_API_KEY}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

entrypoint_log "$ME: Environment variables replaced in nginx configuration"

exit 0