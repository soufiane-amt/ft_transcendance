FROM node:20.8.0

WORKDIR /frontend

COPY . .

EXPOSE 3000

RUN npm install

RUN npm run build

ENTRYPOINT ["npm", "run" ,"start"]
