# Stage 1: Build the application
FROM node:lts-alpine AS build

# Install git
RUN apk update && apk add git

# Create app directory
WORKDIR /usr/src/app

# clone and ckeckout to 8f22b0acc521c4cff27766edc59b643438771707
RUN git clone https://github.com/munshkr/flok.git

WORKDIR /usr/src/app/flok
RUN git checkout flok-next
RUN yarn install --ignore-engines

WORKDIR /usr/src/app/flok/packages/core
RUN yarn build

WORKDIR /usr/src/app/flok/packages/repl
RUN yarn build

WORKDIR /usr/src/app/flok/packages/web
RUN yarn build

# Stage 2: Create a minimal image for running the application
FROM node:lts-alpine

# Copy the built application from the previous stage
COPY --from=build /usr/src/app/flok /usr/src/app/flok

WORKDIR /usr/src/app/flok/packages/web

# Install only runtime dependencies
RUN yarn install --prod --ignore-scripts --prefer-offline
#RUN yarn add yjs
# cmd flok-web
CMD [ "yarn", "start"]
