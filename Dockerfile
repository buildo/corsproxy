FROM node:8-alpine

RUN npm install -g corsproxy-https@1.5.2

EXPOSE 1337

CMD ["corsproxy"]
