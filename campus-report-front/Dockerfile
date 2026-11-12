# ---- 1단계: 빌드 (TypeScript·React → 정적 파일 HTML/JS/CSS) ----
FROM node:22-alpine AS build
WORKDIR /app

# package 파일만 먼저 복사: 소스만 바뀌면 npm ci 단계는 캐시를 재사용한다
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- 2단계: 서빙 (nginx가 정적 파일을 주고, /api 요청은 백엔드로 전달) ----
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
