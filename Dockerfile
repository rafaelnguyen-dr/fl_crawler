FROM node:14.17

# Install app dependencies
# cached node_modules with share volumes
COPY ./package.json /data/package.json
RUN cd /data && npm install
# create working folder
WORKDIR app
#copy all source code file
COPY . .

# copy all node_modules to working folder
RUN pwd
RUN cp -a /data/node_modules ./
# Show current folder structure in logs
RUN ls -al
# setting log level
ENV NPM_CONFIG_LOGLEVEL warn

# Expose the listening port of your app
EXPOSE 3000

RUN node --version
CMD ["npm", "start"]
