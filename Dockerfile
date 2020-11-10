FROM node:10-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .

RUN npm install --quiet
RUN npm install -g typescript --quiet
RUN tsc

# Bundle app source
COPY . .

CMD npm start
