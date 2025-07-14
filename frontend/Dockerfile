FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 12001

# For development
CMD ["npm", "start"]

# For production
# CMD ["npm", "run", "preview", "--", "--port", "12001", "--host"]