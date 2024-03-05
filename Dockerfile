# React 애플리케이션 빌드를 위한 베이스 이미지
FROM node:19.9.0 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# React 애플리케이션 빌드
RUN npm run build

# 최종 실행 이미지
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/dist
COPY .env.production /root/.env

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 실행 명령
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
