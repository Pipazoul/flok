FROM node:lts-alpine

# Install git
RUN apk update && apk add git

# Create app directory
WORKDIR /usr/src/app

# clone and ckeckout to 8f22b0acc521c4cff27766edc59b643438771707
RUN git clone https://github.com/munshkr/flok.git

WORKDIR /usr/src/app/flok
RUN git checkout 8f22b0acc521c4cff27766edc59b643438771707

RUN yarn install --ignore-engines

WORKDIR /usr/src/app/flok/packages/core
RUN yarn build

WORKDIR /usr/src/app/flok/packages/repl
RUN yarn build

WORKDIR /usr/src/app/flok/packages/web
RUN yarn build


# cmd flok-web
CMD [ "yarn", "start"]
