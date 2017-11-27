FROM node:8

#keep this as a separate line so it caches
RUN npm install -g polymer-cli --unsafe-perm
RUN npm install -g bower prpl-server

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN bower install --allow-root && npm install && polymer build
EXPOSE 8080
CMD ["prpl-server", "--root", "build", "--config", "polymer.json", "--bot-proxy", "--host", "0.0.0.0", "--https-redirect"]
