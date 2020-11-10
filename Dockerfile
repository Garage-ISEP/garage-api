FROM node:10-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN npm install --quiet
RUN npm install -g typescript --quiet

RUN tsc

CMD npm start
