FROM node:lts

# Create app directory
WORKDIR /usr/src/app

COPY ./ /usr/src/app/

RUN npm install --legacy-peer-deps

WORKDIR /usr/src/app/packages/core
RUN npm run build

WORKDIR /usr/src/app/packages/web
RUN npm run build

# cmd flok-web
CMD [ "npm", "run", "start" ]
