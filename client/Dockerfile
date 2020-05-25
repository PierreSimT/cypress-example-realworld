FROM node:10

WORKDIR /usr/src/app

COPY ./build ./

RUN npm install -g serve

EXPOSE 5000
CMD ["serve", "-s", "."]