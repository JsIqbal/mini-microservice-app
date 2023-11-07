FROM node:alpine

ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]

# FROM node:alpine

# WORKDIR /app

# COPY package.json .


# COPY . .

# CMD ["sh", "-c", "npm install && npm start"]