FROM node:20.8.0

WORKDIR /backend

COPY . .

EXPOSE 3001

RUN npm install

RUN ["chmod", "+x", "entrypoint.sh"]

ENTRYPOINT ["./entrypoint.sh" ]

 
