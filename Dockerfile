FROM node:lts

# Create app directory
WORKDIR /usr/src/app

COPY ./ /usr/src/app/

RUN npm install --legacy-peer-deps
RUN cd packages/web && npm run build

# cmd flok-web
CMD [ "npm", "run", "start" ]
