FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/prisma ./prisma

RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/server.js"]