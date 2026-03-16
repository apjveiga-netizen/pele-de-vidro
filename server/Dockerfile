FROM node:20-bookworm

WORKDIR /app

# Install build dependencies for native modules (sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install dependencies and rebuild native modules inside the container
RUN npm install --build-from-source

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
