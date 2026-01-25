FROM node:20.8.0

WORKDIR /backend
ARG CACHEBUST=1
COPY back-end/package*.json ./
RUN npm install

COPY back-end/ .

EXPOSE 3001

RUN chmod +x entrypoint.sh
RUN npm run build

ENTRYPOINT ["./entrypoint.sh"]
