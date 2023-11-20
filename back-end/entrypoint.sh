#!/bin/bash

# Install necessary packages
apt-get -y update
apt-get install -y postgresql-client 

# Function to check if the PostgreSQL database is ready
check_postgresql() {
  until pg_isready -h db -p 5432 -q; do
    echo "Waiting for PostgreSQL database to start..."
    sleep 1
  done
  echo "PostgreSQL database is ready!"
}

# Wait for PostgreSQL to start
check_postgresql


# Run the commands once the database is ready
npx prisma migrate dev --name init
npm run build
npm run start