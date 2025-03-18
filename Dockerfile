FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# 애플리케이션 소스 코드 복사
COPY . .
RUN npm run build

FROM nginx:1.21
COPY ./default.conf /etc/nginx/conf.d

COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]