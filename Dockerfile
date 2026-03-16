FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build step if needed, but vite can run dev server too. 
# We'll use dev for now as the user didn't ask for a production build.
# To make it accessible outside the container, we need --host
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
