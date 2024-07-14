# React 애플리케이션 빌드를 위한 베이스 이미지
FROM node:19.9.0 AS builder

# Add Maintainer Info
LABEL maintainer="JYY <yourrubber@duck.com>"

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json package-lock.json ./
# 의존성 설치 (이 레이어는 package.json이 변경되지 않으면 캐시됨)
RUN npm ci
# protobuf-compiler 설치 (이 레이어는 거의 변경되지 않음)
RUN apt-get update && apt-get install -y protobuf-compiler

# 프로토콜 버퍼 파일 복사 및 컴파일
COPY api.proto /app/
RUN mkdir /app/protos
RUN protoc --proto_path=/app --js_out=import_style=commonjs,binary:/app/protos api.proto

# 소스 코드 복사
COPY . .

# React 애플리케이션 빌드
RUN npm run build

# 최종 실행 이미지
FROM nginx:alpine

# 빌드 결과 복사
COPY --from=builder /app/protos /usr/share/nginx/html/protos
COPY --from=builder /app/dist /usr/share/nginx/html

# .env 파일 복사
COPY .env.production /root/.env

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 실행 명령
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]