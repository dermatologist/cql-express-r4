FROM node:14.17.0-alpine3.13

WORKDIR /app

COPY package.json /app
COPY dist/. /app/
COPY node_modules/. /app/node_modules/
COPY src/FHIRHelpers.json /app/src/FHIRHelpers.json
EXPOSE 3000

CMD ["node", "index.js"]