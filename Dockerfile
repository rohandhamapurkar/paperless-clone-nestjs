FROM --platform=linux/arm64 node:14

WORKDIR /usr/app

COPY . .

RUN npm install --save-prod

RUN npm run build

CMD node dist/main