FROM node:20.8.0

WORKDIR /backend

COPY backend/package*.json ./
RUN npm install

COPY back-end/ .

EXPOSE 3001

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
