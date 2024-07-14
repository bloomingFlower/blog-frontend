#!/bin/bash
set -e

export VERSION=$(git rev-parse --short HEAD)
echo $VERSION

rsync -rave "ssh -i ../id_rsa" --checksum --exclude=node_modules --exclude=dist --exclude=.git . $DEPLOY_USER@$DEPLOY_SERVER:~/blog-frontend

ssh -i ../id_rsa $DEPLOY_USER@$DEPLOY_SERVER "
  cd blog-frontend && \
  npm install && \
  npm run build && \
  export VERSION='$VERSION' && \
  docker build --build-arg VERSION=$VERSION -t bloomingflower/blog-frontend:$VERSION . && \
  docker tag bloomingflower/blog-frontend:$VERSION bloomingflower/blog-frontend:latest && \
  docker push bloomingflower/blog-frontend && \
  rm -rf dist
"