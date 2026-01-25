FROM node:20.8.0

WORKDIR /backend
ARG CACHEBUST=1
COPY back-end/package*.json ./
RUN npm install

COPY back-end/ .

RUN npx prisma generate

EXPOSE 3000

RUN chmod +x entrypoint.sh
RUN npm run build

ENTRYPOINT ["./entrypoint.sh"]
