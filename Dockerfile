FROM node:5.1.0

LABEL description="Web service to shorten \
urls, using dynamodb."

# Install Java
RUN apt-get update && apt-get install -y \
  default-jre

# Install Local DynamoDB
RUN (mkdir ~/DynamoDBLocal; cd ~/DynamoDBLocal; curl -s -L http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz | tar xz)
RUN (java -Xms1024m -Xmx1024m -Djava.library.path=~/DynamoDBLocal/DynamoDBLocal_lib -jar ~/DynamoDBLocal/DynamoDBLocal.jar &)

# Create app directory
RUN mkdir -p /usr/src/url-shortener
WORKDIR /usr/src/url-shortener

# Install app dependencies
COPY package.json /usr/src/url-shortener/
RUN npm install

# Bundle app source
COPY . /usr/src/url-shortener

EXPOSE 3070

CMD [ "npm", "start" ]
