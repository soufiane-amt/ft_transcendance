FROM node:20.8.0

WORKDIR /backend

COPY . .


EXPOSE 3001


RUN npm install


# Run the migration command when the container starts
CMD ["npx", "prisma", "migrate", "dev", "--name", "init", "&&", "npm", "run", "build"]

ENTRYPOINT [ "npm" , "run", "start"]