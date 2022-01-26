FROM node:16.13.1

RUN apt-get update && \
    apt-get install -y vim

WORKDIR /opt/app

COPY src .

RUN npm install

ENTRYPOINT ["node", "/opt/app/play-instrument.js"]