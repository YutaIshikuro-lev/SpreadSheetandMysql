FROM node:18.4.0

ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo

WORKDIR /app

RUN npm init -y
RUN npm install -g --save typescript ts-node 
RUN npm install google-spreadsheet dotenv mysql2 dotenv && \
    npm install -y --save-dev @types/google-spreadsheet @types/mysql
RUN npx tsc --init 