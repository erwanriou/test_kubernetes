FROM node:alpine

WORKDIR /app
COPY package.json .
COPY .env.local .

RUN GITHUB_TOKEN=$(grep GITHUB_TOKEN .env.local | cut -d '=' -f2) && echo -e "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN} \n@erwanriou:registry=https://npm.pkg.github.com/erwanriou \nregistry=https://registry.npmjs.org" > .npmrc
RUN rm .env.local
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]
