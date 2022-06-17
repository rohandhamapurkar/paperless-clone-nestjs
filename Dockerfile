# FROM --platform=linux/arm64 node:14
FROM node:14

WORKDIR /usr/app

COPY . .

RUN npm install --save-prod

RUN npm run build

CMD node dist/main

# heroku container:login
# heroku container:push web --app paperless-clone
# heroku container:release web --app paperless-clone