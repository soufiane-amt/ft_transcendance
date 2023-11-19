FROM node:20.8.0

WORKDIR /backend

COPY . .

EXPOSE 3001

RUN npm install

# Set the default command to start your application
RUN ["chmod", "+x", "entrypoint.sh"]

CMD ["./entrypoint.sh" ]

ENTRYPOINT [ "npm", "run" ,"start" ]