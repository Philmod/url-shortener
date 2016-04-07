FROM node:5.1.0

# Create app directory
RUN mkdir -p /usr/src/url-shortener
WORKDIR /usr/src/url-shortener

# Install app dependencies
COPY package.json /usr/src/url-shortener/
RUN npm install

# Bundle app source
COPY . /usr/src/url-shortener

ENV NODE_ENV development
EXPOSE 3070

CMD [ "npm", "start" ]
