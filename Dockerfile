FROM node:16.8.0
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .
CMD [ "npm", "run", "dev" ]