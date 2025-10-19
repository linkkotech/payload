FROM node:18-bullseye-slim

# create app directory
WORKDIR /usr/src/app

# install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# copy project
COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]
